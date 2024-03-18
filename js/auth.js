// Init Auth0
// Fetch the auth_config.json file
fetch('auth_config.json')
    .then(response => response.json())
    .then(config => {
    // Initialize Auth0 with the config
        const auth0 = new Auth0Client({
            domain: config.domain,
            client_id: config.clientId,
            redirect_uri: window.location.origin
        });

    // ... rest of your Auth0 setup code
    })
    .catch(error => console.error('Error loading auth_config.json', error));

// Login function
async function login() {
    try {
        await auth0.loginWithRedirect({
            // Specify the desired redirect URI
            redirect_uri: 'http://localhost:3000'
        });
    } 
    catch (err) {
        console.log('Login failed', err);
    }
}

// Event listener for login
document.getElementById('btn-login').addEventListener('click', login);

// Handle authentication result
window.onload = async () => {
    if (window.location.search.includes('code=')) {
        try {
        // Handle the login result
        await auth0.handleRedirectCallback();
        
        // Retrieve the user's profile
        const user = await auth0.getUser();
        console.log('Logged in user', user);
        
        // Redirect to the home page or dashboard
        window.location.replace(window.location.origin);
        } 
        catch (err) {
        console.log('Error handling redirect', err);
        }
    }
};

// Logout function
function logout() {
    auth0.logout({
        returnTo: window.location.origin
    });
}

document.getElementById('btn-logout').addEventListener('click', logout);

// UI state
auth0.isAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
        document.getElementById('btn-login').style.display = 'none';
        document.getElementById('btn-logout').style.display = 'block';
    }
    else {
        document.getElementById('btn-login').style.display = 'block';
        document.getElementById('btn-logout').style.display = 'none';
    }
});

// Auth routing
if (await auth0.isAuthenticated()) {
    // User is authenticated, show the protected content
    } 
    else {
    // User is not authenticated, redirect to login page
    }

// UpdateUI after login, logout, and handling the authentication result
function updateUI() {
    auth0.isAuthenticated().then(isAuthenticated => {
        if (isAuthenticated) {
            document.getElementById('btn-login').style.display = 'none';
            document.getElementById('btn-logout').style.display = 'block';
        }
        else {
            document.getElementById('btn-login').style.display = 'block';
            document.getElementById('btn-logout').style.display = 'none';
        }
    });
}

// Call updateUI on page load to set initial UI state
updateUI();

if (isAuthenticated) {
    document.getElementById('logout-btn').classList.add('show');
  }
    else {
        document.getElementById('logout-btn').classList.remove('show');
}