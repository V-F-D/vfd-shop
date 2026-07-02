# 🌐 Custom Domain Setup for VFD Shop

You want a better domain than `v-f-d-github-io.vercel.app`

## 🎯 Option 1: Custom Domain (Recommended)

### Buy a Domain

1. **Buy from Namecheap/GoDaddy:**

   - `victoryfashion.co.ke` (~KSh 1,500/year)
   - `vfd-shop.com` (~KSh 1,200/year)
   - `victoryfashionkenya.com` (~$10/year)

2. **Add to Vercel:**
   - Vercel Dashboard → Your Project → Settings → Domains
   - Add custom domain
   - Follow DNS instructions
   - ✅ Your shop will be: `www.victoryfashion.co.ke`

### Free Alternatives

1. **Vercel's cleaner domains:**

   - Go to Vercel project settings
   - Change project name to: `vfd-shop`
   - Your URL becomes: `vfd-shop.vercel.app` ✨

2. **Use GitHub Pages (current):**
   - Already live at: `v-f-d.github.io`
   - But API routes won't work here

---

## 🔄 Option 2: Rename Vercel Project (Easy & Free!)

### Steps:

1. Go to your Vercel dashboard
2. Select your project: `v-f-d-github-io`
3. Settings → General → Project Name
4. Change to: `vfd-shop` or `victory-fashion`
5. ✅ New URL: `vfd-shop.vercel.app` or `victory-fashion.vercel.app`

**This is FREE and takes 30 seconds!**

---

## 🎯 Option 3: Keep GitHub Private + New Vercel Name

If you want to make the repo private AND have a clean URL:

### Steps:

1. **Make repo private:**

   ```
   GitHub → V-F-D/V-F-D.github.io → Settings → Danger Zone → Change visibility → Private
   ```

2. **GitHub Pages will stop working** (since it's now private)

   - That's OK! Vercel will be your primary host

3. **Update Vercel project name:**

   - Settings → General → Project Name
   - Change to: `vfd-shop`
   - New URL: `vfd-shop.vercel.app`

4. **Update environment variables in Vercel:**
   ```
   MPESA_CALLBACK_URL=https://vfd-shop.vercel.app/api/mpesa-callback
   C2B_VALIDATION_URL=https://vfd-shop.vercel.app/api/c2b-validation
   C2B_CONFIRMATION_URL=https://vfd-shop.vercel.app/api/c2b-confirmation
   NEXT_PUBLIC_SITE_URL=https://vfd-shop.vercel.app
   API_BASE_URL=https://vfd-shop.vercel.app
   ```

---

## 💰 Cost Comparison

| Option                    | Cost            | URL Example                  | Setup Time |
| ------------------------- | --------------- | ---------------------------- | ---------- |
| **Rename Vercel Project** | FREE            | `vfd-shop.vercel.app`        | 30 seconds |
| **Custom .co.ke Domain**  | ~KSh 1,500/year | `victoryfashion.co.ke`       | 15 minutes |
| **Custom .com Domain**    | ~$10/year       | `vfd-shop.com`               | 15 minutes |
| **Keep Current**          | FREE            | `v-f-d-github-io.vercel.app` | 0 seconds  |

---

## 🎯 My Recommendation

### For Now:

✅ **Rename Vercel project to `vfd-shop`**

- Free
- Clean URL
- Takes 30 seconds
- URL: `vfd-shop.vercel.app`

### Later (Optional):

✅ **Buy custom domain when business grows**

- Get `victoryfashion.co.ke`
- Professional look
- Better for branding

---

## 🚀 Quick Win: Rename Project Now

1. **Go to:** https://vercel.com/dashboard
2. **Select:** v-f-d-github-io project
3. **Settings → General → Project Name**
4. **Change to:** `vfd-shop`
5. **Save**
6. ✅ **New URL:** `vfd-shop.vercel.app`

**Then update your environment variables with the new URL!**

---

## 📝 After Renaming

Update these environment variables in Vercel:

```env
MPESA_CALLBACK_URL=https://vfd-shop.vercel.app/api/mpesa-callback
C2B_VALIDATION_URL=https://vfd-shop.vercel.app/api/c2b-validation
C2B_CONFIRMATION_URL=https://vfd-shop.vercel.app/api/c2b-confirmation
NEXT_PUBLIC_SITE_URL=https://vfd-shop.vercel.app
API_BASE_URL=https://vfd-shop.vercel.app
```

And re-register C2B URLs with M-Pesa using the new domain!

---

**🎊 Easiest solution: Just rename the Vercel project! 🎊**
