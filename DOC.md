Account Management

1. Get Account Details

Method: GET
Path: /api/v1/account
Description: Retrieves the authenticated user's profile and wallet information. 2. Edit User Profile

Method: PUT
Path: /api/v1/account/edit
Description: Updates the authenticated user's profile. You can send any combination of the fields below. To upload a profile picture, send it as form-data with the key avatar.
Request Body (form-data):
avatar: (file) The user's new profile picture.
username: (text) The user's new username.
first_name: (text) The user's first name.
last_name: (text) The user's last name.
phone: (text) The user's phone number.
address: (text) The user's address.
region: (text) The user's region.
city: (text) The user's city. 3. Change Password

Method: PUT
Path: /api/v1/account/change-password
Description: Allows an authenticated user (who did not sign up with Google) to change their password.
Request Body (json):
{
"oldPassword": "current-password",
"newPassword": "your-new-strong-password",
"confirmPassword": "your-new-strong-password"
} 4. Lodge a Complaint

Method: POST
Path: /api/v1/account/lodge-complaint
Description: Submits a message to the help and complaint system.
Request Body (json):
{
"message": "I am having an issue with..."
}
Schedule Management 5. Create a Schedule (Pickup/Dropoff)

Method: POST
Path: /api/v1/schedule/pickup
Description: Creates a new schedule for material pickup or dropoff. To include an image, send it as form-data.
Request Body (form-data):
material: (text) e.g., "plastic"
material_amount: (text) e.g., 150
container_amount: (text) e.g., 5
date: (text) e.g., "2024-12-31"
address: (text) "123 Main St, Anytown"
category: (text) "pickup" or "dropoff"
image: (file) An optional image for the schedule. 6. Get All Schedules

Method: GET
Path: /api/v1/schedule
Description: Retrieves a list of all schedules for the authenticated user. 7. Get Schedule by ID

Method: GET
Path: /api/v1/schedule/:id
Description: Retrieves a single schedule by its unique ID.
Path Parameters:
id: The UUID of the schedule. 8. Update Schedule Status

Method: PUT
Path: /api/v1/schedule/:id
Description: Allows a user to update the status of their own schedule (e.g., to 'cancelled').
Path Parameters:
id: The UUID of the schedule.
Request Body (json):
{
"status": "cancelled"
} 9. Delete Schedule by ID

Method: DELETE
Path: /api/v1/schedule/:id
Description: Deletes a schedule that belongs to the authenticated user.
Path Parameters:
id: The UUID of the schedule to delete.
Wallet & Transactions 10. Get Wallet Details

Method: GET
Path: /api/v1/wallet
Description: Retrieves the authenticated user's wallet balance and point conversion rate. 11. Get All Transactions

Method: GET
Path: /api/v1/transactions
Description: Retrieves a list of all transactions for the authenticated user.
Donations 12. Get All Donation Campaigns

Method: GET
Path: /api/v1/donation/campaigns
Description: Retrieves a list of all active donation campaigns. 13. Get Donation Campaign by ID

Method: GET
Path: /api/v1/donation/campaigns/:id
Description: Retrieves a single donation campaign by its unique ID.
Path Parameters:
id: The UUID of the donation campaign. 14. Create a Contribution

Method: POST
Path: /api/v1/donation/contribute
Description: Allows a user to contribute to a donation campaign.
Request Body (json):
{
"campaignId": "uuid-of-the-campaign",
"amount": 500
}
Redemptions 15. Redeem Points for Airtime

Method: POST
Path: /api/v1/redeem/airtime
Description: Redeems a specified number of points for airtime.
Request Body (json):
{
"points": 1000,
"phone": "08012345678"
} 16. Redeem Points for Cash

Method: POST
Path: /api/v1/redeem/cash
Description: Redeems a specified number of points for cash, transferred to the user's bank.
Request Body (json):
{
"points": 2000,
"bank_name": "Example Bank",
"account_number": "1234567890"
}

---

## For Admin

Authentication

1. Admin Login

Method: POST
Path: /api/v1/admin/login
Description: Authenticates an admin user and returns access and refresh tokens.
Request Body:
{
"identifier": "admin@example.com",
"password": "yourpassword"
}
Dashboard 2. Get Dashboard Data

Method: GET
Path: /api/v1/admin/dashboard
Description: Retrieves aggregate data for the admin dashboard, including user count, schedule count, and total wallet amount.
Headers: Requires Authorization token.
Admin & User Management 3. Create Admin

Method: POST
Path: /api/v1/admin/create-admin
Description: Creates a new user with the 'admin' role.
Headers: Requires Authorization token.
Request Body:
{
"first_name": "New",
"last_name": "Admin",
"email": "newadmin@example.com",
"password": "a-strong-password"
} 4. Assign Admin Role

Method: PATCH
Path: /api/v1/admin/assign-admin/:id
Description: Assigns the 'admin' role to an existing user.
Headers: Requires Authorization token.
Path Parameters:
id: The UUID of the user to promote. 5. Remove Admin Role

Method: PATCH
Path: /api/v1/admin/remove-admin/:id
Description: Removes the 'admin' role from a user, demoting them to a regular 'user'.
Headers: Requires Authorization token.
Path Parameters:
id: The UUID of the admin to demote. 6. Toggle User Status (Enable/Disable)

Method: PATCH
Path: /api/v1/admin/toggle-user-status/:id
Description: Toggles a user's isDisabled status. If a user is disabled, they will be blocked from logging in.
Headers: Requires Authorization token.
Path Parameters:
id: The UUID of the user to enable or disable. 7. Get All User Accounts

Method: GET
Path: /api/v1/admin/accounts
Description: Retrieves a paginated list of all users with the 'user' role.
Headers: Requires Authorization token.
Query Parameters (Optional):
page: The page number to retrieve (e.g., 1).
pageSize: The number of items per page (e.g., 10).
Password Management 8. Admin Forgot Password

Method: POST
Path: /api/v1/admin/forgot-password
Description: Sends a password reset link to an admin's email address.
Request Body:
{
"email": "admin@example.com"
} 9. Admin Reset Password

Method: POST
Path: /api/v1/admin/reset-password/:token
Description: Resets the admin's password using the token from the reset email.
Path Parameters:
token: The password reset token from the email link.
Request Body:
{
"password": "your-new-strong-password"
}
Schedule Management 10. Accept Schedule

Method: PUT
Path: /api/v1/admin/schedule/accept/:id
Description: Marks a user's schedule as 'accepted'.
Headers: Requires Authorization token.
Path Parameters:
id: The UUID of the schedule to accept. 11. Cancel Schedule

Method: PUT
Path: /api/v1/admin/schedule/cancel/:id
Description: Marks a user's schedule as 'missed'.
Headers: Requires Authorization token.
Path Parameters:
id: The UUID of the schedule to cancel. 12. Fulfill Schedule

Method: POST
Path: /api/v1/admin/schedule/fulfill/:id
Description: Marks a schedule as 'completed' and credits the user's wallet.
Headers: Requires Authorization token.
Path Parameters:
id: The UUID of the schedule to fulfill.
Request Body:
{
"material_amount": 100,
"material": "plastic"
} 13. Get All Schedules

Method: GET
Path: /api/v1/admin/schedules
Description: Retrieves a paginated list of all user schedules.
Headers: Requires Authorization token.
Query Parameters (Optional):
page: The page number to retrieve (e.g., 1).
pageSize: The number of items per page (e.g., 10).
Financial & Donations 14. Get Total Wallet Amount

Method: GET
Path: /api/v1/admin/total-wallet-amount
Description: Retrieves the sum of all naira_amount from all user wallets.
Headers: Requires Authorization token. 15. Get All Donations

Method: GET
Path: /api/v1/admin/donations
Description: Retrieves a list of all donation campaigns.
Headers: Requires Authorization token. 16. Get Donation by ID

Method: GET
Path: /api/v1/admin/donations/:id
Description: Retrieves a single donation campaign by its ID.
Headers: Requires Authorization token.
Path Parameters:
id: The UUID of the donation campaign. 17. Get All Transactions

Method: GET
Path: /api/v1/admin/transactions
Description: Retrieves a paginated list of all transactions.
Headers: Requires Authorization token.
Query Parameters (Optional):
page: The page number to retrieve (e.g., 1).
pageSize: The number of items per page (e.g., 10).
Complaints 18. View Complaints

Method: GET
Path: /api/v1/admin/complaints
Description: Retrieves a paginated list of all complaints submitted by users.
Headers: Requires Authorization token.
Query Parameters (Optional):
page: The page number to retrieve (e.g., 1).
pageSize: The number of items per page (e.g., 10).
