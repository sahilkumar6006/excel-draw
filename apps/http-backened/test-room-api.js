// Simple script to test the room creation API

// First, sign in to get a token
async function testRoomCreation() {
  try {
    // Step 1: Sign in to get a token
    console.log('Signing in to get token...');
    const signInResponse = await fetch('http://localhost:3002/api/v1/user/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (!signInResponse.ok) {
      const errorText = await signInResponse.text();
      console.error('Sign-in failed:', errorText);
      console.log('Creating a test user first...');
      
      // Create a test user if sign-in fails
      const signUpResponse = await fetch('http://localhost:3002/api/v1/user/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          phone: '1234567890',
          photo: 'https://example.com/photo.jpg'
        })
      });
      
      if (!signUpResponse.ok) {
        const signUpErrorText = await signUpResponse.text();
        console.error('Sign-up failed:', signUpErrorText);
        return;
      }
      
      console.log('Test user created, trying to sign in again...');
      
      // Try signing in again
      const retrySignInResponse = await fetch('http://localhost:3002/api/v1/user/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      if (!retrySignInResponse.ok) {
        const retryErrorText = await retrySignInResponse.text();
        console.error('Retry sign-in failed:', retryErrorText);
        return;
      }
      
      const userData = await retrySignInResponse.json();
      var token = userData.token;
    } else {
      const userData = await signInResponse.json();
      var token = userData.token;
    }
    
    console.log('Token obtained:', token);
    
    // Step 2: Create a room using the token
    console.log('Creating a room...');
    const createRoomResponse = await fetch('http://localhost:3002/api/v1/room/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Room'
      })
    });
    
    if (!createRoomResponse.ok) {
      const errorText = await createRoomResponse.text();
      console.error('Room creation failed:', errorText);
      return;
    }
    
    const roomData = await createRoomResponse.json();
    console.log('Room created successfully:', roomData);
    
  } catch (error) {
    console.error('Error during API testing:', error);
  }
}

testRoomCreation();
