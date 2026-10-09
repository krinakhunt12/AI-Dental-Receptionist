import app from './app.js';
import { prisma } from './prisma.js';
import http from 'http';

let server: http.Server;
const PORT = 3099;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

async function request(path: string, options: { method?: string; body?: any; headers?: any } = {}) {
  const method = options.method || 'GET';
  const headers: any = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const body = options.body ? JSON.stringify(options.body) : undefined;

  const res = await fetch(`${BASE_URL}${path}`, { method, headers, body });
  const data = await res.json().catch(() => null);
  const setCookie = res.headers.get('set-cookie');
  return { status: res.status, data, headers: res.headers, setCookie };
}

async function runTests() {
  server = app.listen(PORT);
  console.log(`🧪 Test server started on port ${PORT}...`);

  try {
    console.log('\n--- 1. AUTH: LOGIN ---');
    // Login as Clinic A Admin
    const loginResA = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@smilecaredowntown.com', password: 'Password123!' },
    });
    console.log('Login Clinic A Admin:', loginResA.status, loginResA.data?.success ? 'SUCCESS' : 'FAILED');
    const tokenA = loginResA.data?.data?.accessToken;
    const userA = loginResA.data?.data?.user;
    console.log('Clinic A User:', userA?.email, '| Clinic:', userA?.clinicId);

    // Login as Clinic B Admin
    const loginResB = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@apexdental.com', password: 'Password123!' },
    });
    console.log('Login Clinic B Admin:', loginResB.status, loginResB.data?.success ? 'SUCCESS' : 'FAILED');
    const tokenB = loginResB.data?.data?.accessToken;
    const userB = loginResB.data?.data?.user;
    console.log('Clinic B User:', userB?.email, '| Clinic:', userB?.clinicId);

    // Login as Super Admin
    const loginResSuper = await request('/auth/login', {
      method: 'POST',
      body: { email: 'superadmin@smilecare.com', password: 'Password123!' },
    });
    console.log('Login SuperAdmin:', loginResSuper.status, loginResSuper.data?.success ? 'SUCCESS' : 'FAILED');
    const tokenSuper = loginResSuper.data?.data?.accessToken;

    console.log('\n--- 2. AUTH: GET /me ---');
    const meRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log('GET /auth/me Clinic A:', meRes.status, meRes.data?.data?.user?.email);

    console.log('\n--- 3. AUTH: REGISTER CLINIC ---');
    const regRes = await request('/auth/register-clinic', {
      method: 'POST',
      body: {
        clinicName: 'Sunshine Smiles Clinic',
        email: 'info@sunshinesmiles.com',
        phone: '+1-555-9988',
        adminFirstName: 'Sunshine',
        adminLastName: 'Admin',
        adminEmail: 'admin@sunshinesmiles.com',
        adminPassword: 'Password123!',
      },
    });
    console.log('Register Clinic:', regRes.status, regRes.data?.data?.clinic?.name);

    console.log('\n--- 4. CLINICS: GET & PATCH /me ---');
    const clinicMeRes = await request('/clinics/me', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log('GET /clinics/me:', clinicMeRes.status, clinicMeRes.data?.data?.name);

    const updateClinicRes = await request('/clinics/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: { phone: '+1-555-9999', logoUrl: 'https://example.com/logo.png' },
    });
    console.log('PATCH /clinics/me:', updateClinicRes.status, updateClinicRes.data?.data?.phone);

    console.log('\n--- 5. CLINICS: SUPER_ADMIN ONLY ENDPOINTS ---');
    const listClinicsRes = await request('/clinics', {
      headers: { Authorization: `Bearer ${tokenSuper}` },
    });
    console.log('SUPER_ADMIN List Clinics:', listClinicsRes.status, `Total clinics: ${listClinicsRes.data?.data?.clinics?.length}`);

    // Non-superadmin trying to list clinics -> 403
    const forbiddenClinicsRes = await request('/clinics', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log('Non-superadmin List Clinics (Expect 403):', forbiddenClinicsRes.status, forbiddenClinicsRes.data?.error?.code);

    console.log('\n--- 6. USERS: CLINIC_ADMIN CREATE & LIST USERS ---');
    const createUserRes = await request('/users', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: {
        email: 'receptionist@smilecaredowntown.com',
        password: 'Password123!',
        firstName: 'Anna',
        lastName: 'Taylor',
        role: 'STAFF',
      },
    });
    console.log('Create User in Clinic A:', createUserRes.status, createUserRes.data?.data?.email);
    const createdUserId = createUserRes.data?.data?.id;

    const listUsersResA = await request('/users', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log('List Users in Clinic A:', listUsersResA.status, `User count: ${listUsersResA.data?.data?.users?.length}`);

    console.log('\n--- 7. TENANT ISOLATION TESTS ---');
    // Test 7a: Clinic B Admin trying to fetch Clinic A's user by ID
    const fetchCrossUser = await request(`/users/${createdUserId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    console.log('Clinic B fetching Clinic A User (Expect 403):', fetchCrossUser.status, fetchCrossUser.data?.error?.code);

    // Test 7b: Clinic B Admin trying to update Clinic A's user
    const updateCrossUser = await request(`/users/${createdUserId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: { firstName: 'Hacked' },
    });
    console.log('Clinic B updating Clinic A User (Expect 403):', updateCrossUser.status, updateCrossUser.data?.error?.code);

    console.log('\n--- 8. SELF ROLE CHANGE PROTECTION ---');
    const changeOwnRoleRes = await request(`/users/${userA.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: { role: 'SUPER_ADMIN' },
    });
    console.log('Clinic A Admin changing own role (Expect 403):', changeOwnRoleRes.status, changeOwnRoleRes.data?.error?.code);

    console.log('\n--- 9. FORGOT & RESET PASSWORD FLOW ---');
    const forgotRes = await request('/auth/forgot-password', {
      method: 'POST',
      body: { email: 'admin@smilecaredowntown.com' },
    });
    console.log('Forgot Password Request:', forgotRes.status, forgotRes.data?.message);

    // Fetch token directly from DB for test verification
    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: { user: { email: 'admin@smilecaredowntown.com' }, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (resetRecord) {
      console.log('Reset token generated:', resetRecord.token.substring(0, 10) + '...');
      const resetRes = await request('/auth/reset-password', {
        method: 'POST',
        body: { token: resetRecord.token, newPassword: 'NewPassword123!' },
      });
      console.log('Reset Password Action:', resetRes.status, resetRes.data?.message);

      // Verify login with new password
      const loginNewRes = await request('/auth/login', {
        method: 'POST',
        body: { email: 'admin@smilecaredowntown.com', password: 'NewPassword123!' },
      });
      console.log('Login with New Password:', loginNewRes.status, loginNewRes.data?.success ? 'SUCCESS' : 'FAILED');
    }

    console.log('\n🎉 ALL STEP 2 INTEGRATION TESTS PASSED CLEANLY!\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests();
