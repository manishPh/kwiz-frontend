# 🎯 API Caching Strategy for Better Performance

## The Problem
Even with Cloudflare CDN, API calls still need to travel to Railway US servers (~800ms from India).

## The Solution: Smart Caching

### 📊 API Endpoint Analysis

| Endpoint | Frequency | Cacheable? | Cache Duration | Impact |
|----------|-----------|------------|----------------|--------|
| `GET /api/quiz/status/` | Every page load | ✅ Yes | 5 minutes | **High** |
| `GET /api/quiz/today/` | Once per visit | ⚠️ Partial | 1 hour | **Medium** |
| `GET /api/quiz/archive/` | On archive page | ✅ Yes | 1 hour | **Medium** |
| `POST /api/quiz/submit/` | Once per quiz | ❌ No | N/A | **Low** |
| `GET /api/quiz/results/{id}/` | After submit | ⚠️ Partial | 1 day | **Low** |

---

## 🔧 Implementation

### 1. Cloudflare Page Rules (Set These Up)

**Rule 1: Cache Quiz Status (High Impact)**
```
URL: api.kwiz.fun/api/quiz/status/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 5 minutes
  - Browser Cache TTL: 5 minutes
```

**Why this helps:**
- Most users check status multiple times
- Status doesn't change often (only once per day at midnight)
- Reduces API calls by ~80%

**Rule 2: Cache Today's Quiz (Medium Impact)**
```
URL: api.kwiz.fun/api/quiz/today/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 hour
  - Browser Cache TTL: 30 minutes
```

**Why this helps:**
- Quiz content doesn't change during the day
- Multiple users get same quiz
- Reduces load on Railway server

**Rule 3: Cache Archive (Medium Impact)**
```
URL: api.kwiz.fun/api/quiz/archive/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 hour
  - Browser Cache TTL: 1 hour
```

**Why this helps:**
- Archive data is historical (never changes)
- Can be cached aggressively

---

### 2. Django Cache Headers (Backend)

Add cache headers to your Django views:

```python
# In quiz/views.py

from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

class QuizStatusView(APIView):
    @method_decorator(cache_page(60 * 5))  # 5 minutes
    def get(self, request):
        # Your existing code
        pass

class TodayQuizView(APIView):
    @method_decorator(cache_page(60 * 60))  # 1 hour
    def get(self, request):
        # Your existing code
        pass

class ArchiveView(APIView):
    @method_decorator(cache_page(60 * 60))  # 1 hour
    def get(self, request):
        # Your existing code
        pass
```

---

### 3. Frontend Caching (React)

Add client-side caching to reduce API calls:

```typescript
// In src/services/api.ts or similar

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchWithCache(url: string) {
  const cached = cache.get(url);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached data for:', url);
    return cached.data;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

---

## 📊 Expected Performance Improvement

### Before API Caching:
```
Visit 1:
  - Static assets: 400ms (Cloudflare)
  - quiz/status: 800ms (Railway)
  - quiz/today: 800ms (Railway)
  Total: 2,000ms

Visit 2 (same user, 2 minutes later):
  - Static assets: 50ms (browser cache)
  - quiz/status: 800ms (Railway) ❌
  - quiz/today: 800ms (Railway) ❌
  Total: 1,650ms
```

### After API Caching:
```
Visit 1:
  - Static assets: 400ms (Cloudflare)
  - quiz/status: 800ms (Railway, cached)
  - quiz/today: 800ms (Railway, cached)
  Total: 2,000ms

Visit 2 (same user, 2 minutes later):
  - Static assets: 50ms (browser cache)
  - quiz/status: 50ms (Cloudflare cache) ⚡
  - quiz/today: 50ms (Cloudflare cache) ⚡
  Total: 150ms - 11x faster!
```

---

## ⚠️ Important Considerations

### 1. Cache Invalidation
When you update quiz data, you need to purge Cloudflare cache:

**Manual Purge:**
- Go to Cloudflare Dashboard
- Caching → Configuration
- Click "Purge Everything"

**Automatic Purge (Advanced):**
Use Cloudflare API to purge specific URLs when quiz updates:
```python
import requests

def purge_cloudflare_cache(urls):
    CLOUDFLARE_API_TOKEN = os.environ.get('CLOUDFLARE_API_TOKEN')
    ZONE_ID = os.environ.get('CLOUDFLARE_ZONE_ID')
    
    response = requests.post(
        f'https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache',
        headers={
            'Authorization': f'Bearer {CLOUDFLARE_API_TOKEN}',
            'Content-Type': 'application/json',
        },
        json={'files': urls}
    )
    return response.json()

# Call this when quiz updates
purge_cloudflare_cache([
    'https://api.kwiz.fun/api/quiz/status/',
    'https://api.kwiz.fun/api/quiz/today/'
])
```

### 2. Stale Data Risk
- **quiz/status**: Low risk (updates once per day)
- **quiz/today**: Low risk (same quiz all day)
- **quiz/submit**: Never cache (POST requests)

---

## 🎯 Quick Wins

**Immediate (No Code Changes):**
1. ✅ Set up Cloudflare Page Rules (5 minutes)
2. ✅ Test with browser DevTools
3. ✅ Monitor cache hit rate in Cloudflare Analytics

**Short-term (15 minutes):**
1. Add Django cache decorators
2. Deploy to Railway
3. Verify cache headers in responses

**Long-term (Optional):**
1. Implement frontend caching
2. Set up automatic cache purging
3. Consider Redis for backend caching

---

## 📈 Monitoring

**Check if caching is working:**

1. **Browser DevTools:**
   - Network tab
   - Look for `cf-cache-status: HIT` header
   - Second request should be much faster

2. **Cloudflare Analytics:**
   - Dashboard → Analytics
   - Check "Cache Hit Rate"
   - Should be >80% for static content

3. **Test from India:**
   - https://www.webpagetest.org/
   - Select Mumbai
   - Run test twice
   - Second test should be much faster

---

## 💰 Cost

All of this: **$0** (included in Cloudflare Free plan)

---

## Summary

By caching API responses at Cloudflare edge:
- ✅ First visit: ~2 seconds (same as before)
- ✅ Subsequent visits: ~150ms (13x faster!)
- ✅ Reduced Railway server load
- ✅ Better experience for all users
- ✅ No additional cost

