# Supabase Row Level Security (RLS) Policies

## 🎯 Required Policies for URL Shortener

### **1. `urls` Table Policies**

#### **Policy 1: Public Read for Redirects**
Allows anyone (authenticated or anonymous) to read URL data for redirects.

```sql
CREATE POLICY "Anyone can read URLs for redirect"
ON urls
FOR SELECT
USING (true);
```

#### **Policy 2: Users Can Insert Their Own URLs**
Only authenticated users can create new short URLs.

```sql
CREATE POLICY "Users can insert their own URLs"
ON urls
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### **Policy 3: Users Can Update Their Own URLs**
Users can only update URLs they created.

```sql
CREATE POLICY "Users can update their own URLs"
ON urls
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### **Policy 4: Users Can Delete Their Own URLs**
Users can only delete URLs they created.

```sql
CREATE POLICY "Users can delete their own URLs"
ON urls
FOR DELETE
USING (auth.uid() = user_id);
```

---

### **2. `clicks` Table Policies**

#### **Policy 1: Public Insert for Click Tracking**
Allows anyone (authenticated or anonymous) to record clicks.

```sql
CREATE POLICY "Anyone can insert clicks"
ON clicks
FOR INSERT
WITH CHECK (true);
```

#### **Policy 2: Users Can Read Clicks for Their URLs**
Users can only view click statistics for URLs they own.

```sql
CREATE POLICY "Users can read clicks for their URLs"
ON clicks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM urls
    WHERE urls.id = clicks.url_id
    AND urls.user_id = auth.uid()
  )
);
```

---

## 📋 **How to Apply These Policies**

### **Step 1: Access Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Policies**

### **Step 2: Enable RLS (if not already enabled)**
```sql
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
```

### **Step 3: Remove Conflicting Policies**
- Delete any existing policies on `urls` and `clicks` tables that might conflict
- You can do this from the Supabase dashboard UI or using SQL

### **Step 4: Create New Policies**
- Copy and paste each policy from above into the SQL Editor
- Run them one by one
- Verify they appear in the Policies tab

### **Step 5: Test the Setup**

#### **Test 1: Anonymous Access (Should Work)**
- Open an incognito window
- Try accessing a shortened URL
- Should redirect successfully
- Click should be recorded in the database

#### **Test 2: Authenticated Access (Should Work)**
- Log in to your dashboard
- Should see all your URLs
- Should see click statistics
- Should be able to create/update/delete URLs

#### **Test 3: Unauthorized Access (Should Fail)**
- Try to access another user's URL details page
- Should redirect to dashboard or show error
- Should NOT be able to see other users' URLs

---

## 🔍 **Troubleshooting**

### **If redirects still don't work:**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('urls', 'clicks');

-- Should show rowsecurity = true for both tables
```

### **If clicks aren't being recorded:**
```sql
-- Check if clicks table has the correct structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clicks';

-- Required columns: id, url_id, city, country, device_type, browser, created_at
```

### **If dashboard shows no data:**
```sql
-- Verify user_id is correctly set on URLs
SELECT id, user_id, short_url 
FROM urls 
WHERE user_id = 'YOUR_USER_ID';

-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
```

---

## ✅ **Quick Verification Script**

Run this in Supabase SQL Editor to verify all policies are set correctly:

```sql
-- List all policies for urls table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'urls';

-- List all policies for clicks table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'clicks';
```

---

## 🚨 **Important Notes**

1. **Public Read on URLs**: This is necessary for redirects to work. It doesn't expose sensitive data.
2. **Public Insert on Clicks**: Required for anonymous click tracking. No sensitive data is inserted.
3. **User Data Protection**: Even with public read, users can only modify/delete their own URLs.
4. **Click Privacy**: Users can only see click stats for their own URLs.

---

## 📊 **Expected Behavior After Fix**

### ✅ **Anonymous Users Can:**
- Access shortened URLs (e.g., `https://forReal.URL/abc123`)
- Get redirected to original URLs
- Have their clicks recorded for analytics

### ✅ **Authenticated Users Can:**
- Create new shortened URLs
- View their dashboard with all their URLs
- See click statistics for their URLs
- Update and delete their own URLs
- Download QR codes for their URLs

### ❌ **No One Can:**
- View other users' URLs in their dashboard
- Modify or delete URLs they don't own
- See click statistics for URLs they don't own

---

## 🔧 **One-Click Setup (Run All at Once)**

If you want to set up everything at once, run this complete script:

```sql
-- Enable RLS
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Anyone can read URLs for redirect" ON urls;
DROP POLICY IF EXISTS "Users can insert their own URLs" ON urls;
DROP POLICY IF EXISTS "Users can update their own URLs" ON urls;
DROP POLICY IF EXISTS "Users can delete their own URLs" ON urls;
DROP POLICY IF EXISTS "Anyone can insert clicks" ON clicks;
DROP POLICY IF EXISTS "Users can read clicks for their URLs" ON clicks;

-- Create URLs policies
CREATE POLICY "Anyone can read URLs for redirect"
ON urls FOR SELECT USING (true);

CREATE POLICY "Users can insert their own URLs"
ON urls FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own URLs"
ON urls FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own URLs"
ON urls FOR DELETE USING (auth.uid() = user_id);

-- Create Clicks policies
CREATE POLICY "Anyone can insert clicks"
ON clicks FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read clicks for their URLs"
ON clicks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM urls
    WHERE urls.id = clicks.url_id
    AND urls.user_id = auth.uid()
  )
);
```

---

## 📝 **Summary**

After applying these policies:
- ✅ Anonymous users can visit shortened links
- ✅ Clicks are recorded in the database
- ✅ Dashboard shows click statistics correctly
- ✅ User data remains protected
- ✅ No authentication required for redirects
