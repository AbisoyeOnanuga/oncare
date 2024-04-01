//Init Login Auth0
async function login(auth0) {
    try {
        await auth0.loginWithRedirect({
            // Specify the desired redirect URI
            redirect_uri: 'http://localhost:5000'
        });
    } catch (err) {
        console.log('Login failed', err);
    }
}

//Logout
function logout(auth0) {
    auth0.logout({
        returnTo: window.location.origin
    });
}

//UpdateUI function
function updateUI(auth0) {
    auth0.isAuthenticated().then(isAuthenticated => {
        const loginBtn = document.getElementById('btn-login');
        const logoutBtn = document.getElementById('btn-logout');
        const userContent = document.getElementById('user-content'); // Replace with your content ID

        if (isAuthenticated) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            userContent.style.display = 'block'; // Show user-specific content
        } else {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            userContent.style.display = 'none'; // Hide user-specific content
        }
    });
}

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

        // Event listener for login
        document.getElementById('btn-login').addEventListener('click', () => {
            // Call the login function
            login(auth0);
        });

        // Handle authentication result
        window.onload = async () => {
            if (window.location.search.includes('code=')) {
                try {
                    // Handle the login result
                    await auth0.handleRedirectCallback();
                    
                    // Update UI after login
                    updateUI(auth0);
                } catch (err) {
                    console.log('Error handling redirect', err);
                }
            } else {
                // Update UI state based on authentication when page loads
                updateUI(auth0);
            }
        };

        // Define the login function
        async function login(auth0) {
            try {
                await auth0.loginWithRedirect({
                    // Specify the desired redirect URI
                    redirect_uri: 'http://localhost:5000'
                });
            } catch (err) {
                console.log('Login failed', err);
            }
        }

        // Define the logout function
        function logout(auth0) {
            auth0.logout({
                returnTo: window.location.origin
            });
        }

        // Event listener for logout
        document.getElementById('btn-logout').addEventListener('click', () => {
            // Call the logout function
            logout(auth0);
        });

        // Define the updateUI function
        function updateUI(auth0) {
            auth0.isAuthenticated().then(isAuthenticated => {
                if (isAuthenticated) {
                    // User is authenticated, show the protected content
                    document.getElementById('btn-login').style.display = 'none';
                    document.getElementById('btn-logout').style.display = 'block';
                    // Redirect to the user's account page
                    window.location.replace('/user.html'); // <-- Protected route redirection
                } else {
                    // User is not authenticated, redirect to login page
                    document.getElementById('btn-login').style.display = 'block';
                    document.getElementById('btn-logout').style.display = 'none';
                    // Optionally, redirect to the login page
                    // window.location.replace('/login.html'); // <-- Redirect to login page if needed
                }
            });
        }
    })
    .catch(error => console.error('Error loading auth_config.json', error));