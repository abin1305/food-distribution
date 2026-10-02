import { getDb, saveDb, logActivity, computeGlobalImpactStats, calculateDistance } from './db';
import { User, ProviderProfile, ReceiverProfile, FoodListing, FoodRequest, Donation } from '../types';

export function setupMockApi() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    if (!urlString.startsWith('/api/') && !urlString.includes('/api/')) {
      return originalFetch(input, init);
    }

    const parsedUrl = new URL(urlString, window.location.origin);
    const pathname = parsedUrl.pathname;
    const method = (init?.method || 'GET').toUpperCase();
    const query = parsedUrl.searchParams;

    let bodyData: any = null;
    if (init?.body && typeof init.body === 'string') {
      try {
        bodyData = JSON.parse(init.body);
      } catch (e) {
        bodyData = {};
      }
    }

    const db = getDb();

    // Utility helper for JSON responses
    const json = (data: any, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });

    try {
      // ---------------- AUTH ENDPOINTS ----------------
      if (pathname === '/api/auth/login' && method === 'POST') {
        const { email } = bodyData || {};
        const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

        if (!user) {
          return json({ message: 'Invalid credentials or user not found' }, 401);
        }

        let profile: ProviderProfile | ReceiverProfile | null = null;
        if (user.role === 'provider') {
          profile = db.providers.find((p) => p.userId === user.id) || null;
        } else if (user.role === 'receiver') {
          profile = db.receivers.find((r) => r.userId === user.id) || null;
        }

        logActivity(user.name, user.role, 'USER_LOGIN', `User ${user.name} logged in.`);
        return json({ token: `mock_jwt_${Date.now()}`, user, profile });
      }

      if (pathname === '/api/auth/register' && method === 'POST') {
        const { role, email, name, phone, providerData, receiverData } = bodyData || {};
        const existing = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
        if (existing) {
          return json({ message: 'User with this email already exists' }, 400);
        }

        const newUser: User = {
          id: `usr_${Date.now()}`,
          email,
          name: name || 'New Organization',
          role: role || 'provider',
          status: 'pending',
          phone,
          createdAt: new Date().toISOString(),
        };

        db.users.push(newUser);

        let profileData: any = null;
        if (role === 'provider') {
          profileData = {
            id: `prv_${Date.now()}`,
            userId: newUser.id,
            orgName: providerData?.orgName || name,
            providerType: providerData?.providerType || 'Hotel',
            phone: phone || '+1 555 000 0000',
            email,
            address: providerData?.address || 'Metro City Center',
            city: providerData?.city || 'Metro City',
            district: providerData?.district || 'Central',
            state: providerData?.state || 'CA',
            pincode: providerData?.pincode || '90001',
            lat: 37.7749,
            lng: -122.4194,
            foodHandlingLicense: providerData?.foodHandlingLicense || 'PENDING-REG',
            availableFoodTypes: providerData?.availableFoodTypes || ['Meals', 'Buffet'],
            status: 'pending',
            ratingAverage: 5.0,
            totalDonations: 0,
            totalMealsDonated: 0,
            totalFoodSavedKg: 0,
          };
          db.providers.push(profileData);
        } else if (role === 'receiver') {
          profileData = {
            id: `rcv_${Date.now()}`,
            userId: newUser.id,
            orgName: receiverData?.orgName || name,
            contactPerson: name,
            receiverType: receiverData?.receiverType || 'NGO',
            phone: phone || '+1 555 000 0000',
            email,
            address: receiverData?.address || 'Metro City Shelter',
            city: receiverData?.city || 'Metro City',
            district: receiverData?.district || 'Central',
            state: receiverData?.state || 'CA',
            pincode: receiverData?.pincode || '90001',
            lat: 37.7811,
            lng: -122.4285,
            peopleServedNormally: receiverData?.peopleServedNormally || 50,
            operatingHours: '8:00 AM - 8:00 PM',
            foodRequirements: receiverData?.foodRequirements || 'Cooked meals & rice',
            description: receiverData?.description || 'Community welfare organization',
            status: 'pending',
            ratingAverage: 5.0,
            totalMealsReceived: 0,
            totalDonationsReceived: 0,
          };
          db.receivers.push(profileData);
        }

        saveDb(db);
        logActivity(newUser.name, newUser.role, 'USER_REGISTERED', `Registered new account for ${newUser.name}.`);
        return json({ token: `mock_jwt_${Date.now()}`, user: newUser, profile: profileData });
      }

      if (pathname === '/api/auth/forgot-password' && method === 'POST') {
        return json({ message: 'Password reset link sent to your email.' });
      }

      // ---------------- PROVIDERS & RECEIVERS ----------------
      if (pathname === '/api/providers' && method === 'GET') {
        const userId = query.get('userId');
        const status = query.get('status');
        let list = [...db.providers];
        if (userId) list = list.filter((p) => p.userId === userId);
        if (status) list = list.filter((p) => p.status === status);
        return json(list);
      }

      if (pathname === '/api/receivers' && method === 'GET') {
        const userId = query.get('userId');
        const status = query.get('status');
        let list = [...db.receivers];
        if (userId) list = list.filter((r) => r.userId === userId);
        if (status) list = list.filter((r) => r.status === status);
        return json(list);
      }

      // ---------------- FOOD LISTINGS ----------------
      if (pathname === '/api/food' && method === 'GET') {
        const providerId = query.get('providerId');
        let list = [...db.foodListings];
        if (providerId) {
          list = list.filter((f) => f.providerId === providerId);
        }
        return json(list);
      }

      if (pathname === '/api/food' && method === 'POST') {
        const provider = db.providers.find((p) => p.id === bodyData.providerId) || db.providers[0];
        const newListing: FoodListing = {
          id: `fst_${Date.now()}`,
          providerId: provider.id,
          providerName: provider.orgName,
          providerType: provider.providerType,
          providerPhone: provider.phone,
          foodName: bodyData.foodName || 'Surplus Meals',
          category: bodyData.category || 'Meals',
          description: bodyData.description || 'Fresh food available',
          quantity: Number(bodyData.quantity) || 50,
          quantityUnit: bodyData.quantityUnit || 'servings',
          estimatedServings: Number(bodyData.estimatedServings || bodyData.quantity) || 50,
          isVegetarian: bodyData.isVegetarian !== undefined ? bodyData.isVegetarian : true,
          preparationTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
          preparedDate: new Date().toISOString().slice(0, 10),
          bestBeforeTime: bodyData.bestBeforeTime || new Date(Date.now() + 6 * 3600000).toISOString().replace('T', ' ').slice(0, 16),
          availableFrom: 'Immediately',
          availableUntil: 'Till expiry',
          pickupOrDelivery: bodyData.pickupOrDelivery || 'both',
          address: provider.address,
          city: provider.city,
          lat: provider.lat,
          lng: provider.lng,
          imageUrl: bodyData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
          specialInstructions: bodyData.specialInstructions || 'Handled with care',
          status: 'active',
          remainingQuantity: Number(bodyData.quantity) || 50,
          createdAt: new Date().toISOString(),
          allergens: bodyData.allergens || ['Freshly Prepared'],
          storageCondition: bodyData.storageCondition || 'Insulated Container',
        };

        db.foodListings.unshift(newListing);

        // Notify nearby receivers
        db.receivers.forEach((rcv) => {
          db.notifications.unshift({
            id: `notif_${Date.now()}_${rcv.id}`,
            userId: rcv.userId,
            title: '🎉 New Surplus Food Listed!',
            message: `${provider.orgName} posted ${newListing.quantity} ${newListing.quantityUnit} of ${newListing.foodName}.`,
            type: 'info',
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        });

        saveDb(db);
        logActivity(provider.orgName, 'provider', 'FOOD_LISTED', `Listed ${newListing.foodName} (${newListing.quantity} servings).`);
        return json(newListing, 201);
      }

      // ---------------- FOOD REQUESTS ----------------
      if (pathname === '/api/requests' && method === 'GET') {
        const receiverId = query.get('receiverId');
        let list = [...db.foodRequests];
        if (receiverId) {
          list = list.filter((r) => r.receiverId === receiverId);
        }
        return json(list);
      }

      if (pathname === '/api/requests' && method === 'POST') {
        const receiver = db.receivers.find((r) => r.id === bodyData.receiverId) || db.receivers[0];
        const newRequest: FoodRequest = {
          id: `req_${Date.now()}`,
          receiverId: receiver.id,
          receiverName: receiver.orgName,
          receiverType: receiver.receiverType,
          receiverPhone: receiver.phone,
          peopleCount: Number(bodyData.peopleCount) || 50,
          foodType: bodyData.foodType || 'Balanced Meals',
          requiredQuantity: Number(bodyData.requiredQuantity || bodyData.peopleCount) || 50,
          fulfilledQuantity: 0,
          remainingQuantity: Number(bodyData.requiredQuantity || bodyData.peopleCount) || 50,
          quantityUnit: 'servings',
          mealTime: bodyData.mealTime || 'Night',
          requiredDate: bodyData.requiredDate || new Date().toISOString().slice(0, 10),
          requiredTime: bodyData.requiredTime || '20:00',
          address: receiver.address,
          city: receiver.city,
          lat: receiver.lat,
          lng: receiver.lng,
          preference: bodyData.preference || 'both',
          urgency: bodyData.urgency || 'normal',
          isRecurring: bodyData.isRecurring || false,
          specialRequirements: bodyData.specialRequirements || 'Nutritious cooked food',
          notes: bodyData.notes || '',
          status: 'active',
          createdAt: new Date().toISOString(),
        };

        db.foodRequests.unshift(newRequest);

        // Notify active providers
        db.providers.forEach((prv) => {
          db.notifications.unshift({
            id: `notif_${Date.now()}_${prv.id}`,
            userId: prv.userId,
            title: '🆘 Urgent Food Request Nearby!',
            message: `${receiver.orgName} requested ${newRequest.requiredQuantity} meals for ${newRequest.peopleCount} people.`,
            type: 'request',
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        });

        saveDb(db);
        logActivity(receiver.orgName, 'receiver', 'FOOD_REQUESTED', `Requested ${newRequest.requiredQuantity} meals for ${newRequest.peopleCount} people.`);
        return json(newRequest, 201);
      }

      // ---------------- DONATIONS & LOGISTICS ----------------
      if (pathname === '/api/donations' && method === 'GET') {
        const providerId = query.get('providerId');
        const receiverId = query.get('receiverId');
        let list = [...db.donations];
        if (providerId) list = list.filter((d) => d.providerId === providerId);
        if (receiverId) list = list.filter((d) => d.receiverId === receiverId);
        return json(list);
      }

      if (pathname === '/api/donations/offer' && method === 'POST') {
        const provider = db.providers.find((p) => p.id === bodyData.providerId) || db.providers[0];
        const receiver = db.receivers.find((r) => r.id === bodyData.receiverId) || db.receivers[0];

        const newDonation: Donation = {
          id: `don_${Date.now()}`,
          providerId: provider.id,
          providerName: provider.orgName,
          receiverId: receiver.id,
          receiverName: receiver.orgName,
          foodName: bodyData.foodName || 'Surplus Dinner Feast',
          offeredQuantity: Number(bodyData.offeredQuantity) || 50,
          quantityUnit: 'servings',
          estimatedServings: Number(bodyData.offeredQuantity) || 50,
          deliveryOption: bodyData.deliveryOption || 'provider_delivery',
          status: 'Offer Sent',
          providerPhone: provider.phone,
          receiverPhone: receiver.phone,
          pickupAddress: provider.address,
          deliveryAddress: receiver.address,
          providerLat: provider.lat,
          providerLng: provider.lng,
          receiverLat: receiver.lat,
          receiverLng: receiver.lng,
          estimatedTime: `${Math.round(calculateDistance(provider.lat, provider.lng, receiver.lat, receiver.lng) * 4 + 15)} mins`,
          deliveryNotes: 'Temperature verified & safely packed.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        db.donations.unshift(newDonation);

        // Notify Receiver
        db.notifications.unshift({
          id: `notif_${Date.now()}_${receiver.userId}`,
          userId: receiver.userId,
          title: '🎁 Surplus Food Donation Offered!',
          message: `${provider.orgName} offered ${newDonation.offeredQuantity} servings of ${newDonation.foodName}.`,
          type: 'donation',
          isRead: false,
          createdAt: new Date().toISOString(),
        });

        saveDb(db);
        logActivity(provider.orgName, 'provider', 'DONATION_OFFERED', `Offered ${newDonation.offeredQuantity} servings to ${receiver.orgName}.`);
        return json(newDonation, 201);
      }

      if (pathname.match(/\/api\/donations\/[^/]+\/status/) && method === 'PATCH') {
        const parts = pathname.split('/');
        const donationId = parts[3];
        const { status } = bodyData || {};

        const donation = db.donations.find((d) => d.id === donationId);
        if (donation) {
          donation.status = status;
          donation.updatedAt = new Date().toISOString();

          if (status === 'Completed') {
            const prv = db.providers.find((p) => p.id === donation.providerId);
            const rcv = db.receivers.find((r) => r.id === donation.receiverId);
            if (prv) {
              prv.totalDonations += 1;
              prv.totalMealsDonated += donation.estimatedServings || donation.offeredQuantity;
              prv.totalFoodSavedKg += Math.round((donation.estimatedServings || donation.offeredQuantity) * 0.35);
            }
            if (rcv) {
              rcv.totalDonationsReceived += 1;
              rcv.totalMealsReceived += donation.estimatedServings || donation.offeredQuantity;
            }
          }

          saveDb(db);
          logActivity('Logistics Engine', 'system', 'DONATION_STATUS_UPDATE', `Donation ${donationId} status updated to ${status}.`);
          return json(donation);
        }
        return json({ message: 'Donation not found' }, 404);
      }

      if (pathname.match(/\/api\/donations\/[^/]+\/feedback/) && method === 'POST') {
        const parts = pathname.split('/');
        const donationId = parts[3];
        const donation = db.donations.find((d) => d.id === donationId);

        const newReview = {
          id: `rev_${Date.now()}`,
          donationId,
          providerId: donation?.providerId || 'prv_1',
          receiverId: donation?.receiverId || 'rcv_1',
          receiverName: donation?.receiverName || 'Receiver Org',
          providerName: donation?.providerName || 'Provider Org',
          rating: Number(bodyData.rating) || 5,
          feedbackText: bodyData.feedbackText || 'Food was delicious and fresh!',
          thankYouMessage: bodyData.thankYouMessage || 'Thank you for your generous contribution!',
          createdAt: new Date().toISOString(),
        };

        db.reviews.unshift(newReview);
        saveDb(db);
        return json(newReview, 201);
      }

      // ---------------- NOTIFICATIONS ----------------
      if (pathname === '/api/notifications' && method === 'GET') {
        const userId = query.get('userId');
        let list = [...db.notifications];
        if (userId) list = list.filter((n) => n.userId === userId);
        return json(list);
      }

      if (pathname.match(/\/api\/notifications\/[^/]+\/read/) && method === 'PATCH') {
        const parts = pathname.split('/');
        const notifId = parts[3];
        const n = db.notifications.find((item) => item.id === notifId);
        if (n) n.isRead = true;
        saveDb(db);
        return json({ success: true });
      }

      if (pathname === '/api/notifications/read-all' && method === 'POST') {
        const { userId } = bodyData || {};
        db.notifications.forEach((n) => {
          if (!userId || n.userId === userId) n.isRead = true;
        });
        saveDb(db);
        return json({ success: true });
      }

      // ---------------- IMPACT & PUBLIC ENDPOINTS ----------------
      if (pathname === '/api/impact' && method === 'GET') {
        const stats = computeGlobalImpactStats(db);
        const co2SavedKg = Math.round(stats.foodSavedKg * 2.5); // 1kg food saved = 2.5kg CO2 avoided
        const treesEquivalent = Math.round(co2SavedKg / 21); // ~21kg CO2 absorbed per tree per year

        return json({
          stats: {
            ...stats,
            co2SavedKg,
            treesEquivalent,
          },
          categoryBreakdown: [
            { name: 'Prepared Meals', value: 45, color: '#10b981' },
            { name: 'Rice & Grains', value: 25, color: '#3b82f6' },
            { name: 'Bakery & Breads', value: 15, color: '#f59e0b' },
            { name: 'Fruits & Veggies', value: 15, color: '#8b5cf6' },
          ],
          monthlyTrends: [
            { month: 'Jan', meals: 1200, co2: 1050 },
            { month: 'Feb', meals: 1800, co2: 1575 },
            { month: 'Mar', meals: 2400, co2: 2100 },
            { month: 'Apr', meals: 3100, co2: 2710 },
            { month: 'May', meals: 4200, co2: 3675 },
            { month: 'Jun', meals: 5570, co2: 4870 },
          ],
        });
      }

      if (pathname === '/api/contact' && method === 'POST') {
        const newMsg = {
          id: `msg_${Date.now()}`,
          name: bodyData.name,
          email: bodyData.email,
          phone: bodyData.phone,
          subject: bodyData.subject,
          message: bodyData.message,
          status: 'new' as const,
          createdAt: new Date().toISOString(),
        };
        db.contactMessages.unshift(newMsg);
        saveDb(db);
        return json(newMsg, 201);
      }

      // ---------------- ADMIN ENDPOINTS ----------------
      if (pathname === '/api/admin/overview' && method === 'GET') {
        const stats = computeGlobalImpactStats(db);
        return json({
          stats,
          recentLogs: db.activityLogs.slice(0, 10),
          pendingProvidersCount: db.providers.filter((p) => p.status === 'pending').length,
          pendingReceiversCount: db.receivers.filter((r) => r.status === 'pending').length,
        });
      }

      if (pathname === '/api/admin/users' && method === 'GET') {
        return json(db.users);
      }

      if (pathname.match(/\/api\/admin\/users\/[^/]+\/status/) && method === 'PATCH') {
        const parts = pathname.split('/');
        const userId = parts[4];
        const { status } = bodyData || {};

        const user = db.users.find((u) => u.id === userId);
        if (user) {
          user.status = status;
          const prv = db.providers.find((p) => p.userId === userId);
          const rcv = db.receivers.find((r) => r.userId === userId);
          if (prv) prv.status = status;
          if (rcv) rcv.status = status;

          saveDb(db);
          logActivity('Admin', 'admin', 'USER_STATUS_CHANGE', `Changed user ${user.name} status to ${status}.`);
          return json(user);
        }
        return json({ message: 'User not found' }, 404);
      }

      if (pathname === '/api/admin/logs' && method === 'GET') {
        return json(db.activityLogs);
      }

      // Fallback for unhandled /api calls
      return json({ message: 'Endpoint not implemented in mock API' }, 404);
    } catch (err: any) {
      console.error('Mock API Error:', err);
      return json({ message: 'Internal Server Error', error: err.message }, 500);
    }
  };

  console.log('⚡ NourishBridge Mock API interceptor active');
}
