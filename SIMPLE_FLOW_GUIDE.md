# RepTrack - Simple Flow Guide

## 🎯 What is This?

A gym management system with 3 types of people:
- **Admin** - Creates gyms
- **Gym Owner** - Manages their gym
- **User** - Gym member (mobile app)

---

## 👥 The 3 Roles

### 🔴 ADMIN
**Login:** Email + Password

**Can do:**
- Create gym owners
- View all gym owners
- Update/delete gym owners

**Token:** Admin Token

---

### 🔵 GYM OWNER
**Login:** Unique ID (RT-01) + Password

**Can do:**
- Add gym members
- Add gym equipment
- View members & equipment (only their gym)
- Update their profile

**Token:** Gym Owner Token

**Note:** Each gym owner sees only their own gym data

---

### 🟢 USER (Gym Member)
**Login:** Unique ID (RTU-112) + Phone → Get OTP → Enter OTP

**Can do:**
- View/update own profile
- Upload photo
- Track fitness

**Token:** User Token

**Note:** Users see only their own data

---

## 🔄 How It Works (Complete Flow)

```
1. ADMIN creates GYM OWNER
   Email/Password → Admin Token → Creates gym owner

2. GYM OWNER logs in
   RT-01 + Password → Gym Owner Token

3. GYM OWNER creates USER
   Uses Gym Owner Token → Creates member → RTU-112 generated

4. USER logs in
   RTU-112 + Phone → OTP sent → Enter OTP → User Token

5. USER uses app
   Uses User Token → View/update profile
```

---

## 🔐 Token Requirements

### ❌ No Token Needed:
- Login endpoints
- OTP verification

### 🔴 Admin Token Needed:
- Create/view/update gym owners

### 🔵 Gym Owner Token Needed:
- Manage users
- Manage equipment
- Update own profile

### 🟢 User Token Needed:
- View/update own profile
- Logout

---

## 📊 Who Sees What?

```
ADMIN
  → Sees all gym owners
  → Does NOT see individual users or equipment

GYM OWNER (RT-01)
  → Sees only THEIR gym's users
  → Sees only THEIR gym's equipment
  → Cannot see other gyms

GYM OWNER (RT-02)
  → Different gym
  → Different users
  → Different equipment

USER (RTU-112)
  → Sees only THEIR OWN profile
  → Cannot see other users
```

---

## 🎬 Simple Example

**Day 1:**
```
Admin → Creates gym owner "Mike" → Gets RT-01
```

**Day 2:**
```
Mike → Logs in with RT-01 → Creates member "Sarah" → Gets RTU-120
Mike → Adds equipment: Treadmill, Dumbbells
```

**Day 3:**
```
Sarah → Logs in with RTU-120 + phone
Sarah → Gets OTP → Enters OTP
Sarah → Updates profile, uploads photo
```

---

## 🚨 Common Mistakes

| Problem | Solution |
|---------|----------|
| "User not found" | Check phone number format matches registration |
| "Token expired" | Login again (tokens expire after 24 hours) |
| "Access denied" | Using wrong token type for endpoint |
| "Missing Authorization" | Add header: `Authorization: Bearer <TOKEN>` |

---

## 🎓 Quick Reference

### Unique IDs:
- Gym Owner: `RT-01`, `RT-02`, `RT-03`
- User: `RTU-112`, `RTU-113`, `RTU-114`

### Login Methods:
- Admin: Email + Password
- Gym Owner: Unique ID + Password
- User: Unique ID + Phone + OTP

### Images:
- Uploaded to AWS S3
- Max size: 5MB
- Formats: JPG, PNG, GIF, WEBP

### Field Names (for Postman):
- Profile: `profile_image`
- Gym Logo: `gym_logo`
- Equipment: `equipment_image`

---

## ✅ Summary

**3 Levels:**
1. Admin → Controls gyms
2. Gym Owner → Controls members & equipment
3. User → Controls own profile

**Each level needs correct token!**

**Data is completely separate per gym!**

---

**That's it! Simple!** 🎯
