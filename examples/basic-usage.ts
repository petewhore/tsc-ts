import { TableauServer, PersonalAccessTokenAuth, UserItem } from '../src/index.js';

/**
 * Basic usage example for Tableau Server Client TypeScript
 * 
 * Replace the placeholder values with your actual server details
 */

async function basicExample() {
  // Create server instance
  const server = new TableauServer('https://YOUR_TABLEAU_SERVER.com');

  // Create authentication - replace with your actual token details
  const auth = new PersonalAccessTokenAuth(
    'YOUR_TOKEN_NAME',      // Replace with your token name
    'YOUR_TOKEN_VALUE',     // Replace with your token value
    'YOUR_SITE_ID'          // Replace with your site ID (optional)
  );

  try {
    // Sign in to the server
    console.log('Signing in to Tableau Server...');
    await server.auth.signIn(auth);
    console.log('Successfully signed in!');

    // Get server info
    const serverInfo = await server.serverInfo();
    console.log('Server info:', serverInfo);

    // List users
    console.log('\\nFetching users...');
    const { users, pagination } = await server.users.get();
    console.log(`Found ${users.length} users (Page ${pagination.pageNumber} of ${pagination.totalPages})`);
    
    users.forEach(user => {
      console.log(`- ${user.name} (${user.siteRole})`);
    });

    // List workbooks
    console.log('\\nFetching workbooks...');
    const { workbooks } = await server.workbooks.get();
    console.log(`Found ${workbooks.length} workbooks`);
    
    workbooks.forEach(workbook => {
      console.log(`- ${workbook.name} (${workbook.contentUrl})`);
    });

    // List projects
    console.log('\\nFetching projects...');
    const { projects } = await server.projects.get();
    console.log(`Found ${projects.length} projects`);
    
    projects.forEach(project => {
      console.log(`- ${project.name}`);
    });

    // Example: Create a new user (commented out for safety)
    /*
    const newUser = new UserItem({
      name: 'newuser@example.com',
      siteRole: 'Viewer'
    });
    const createdUser = await server.users.create(newUser);
    console.log('Created user:', createdUser.name);
    */

    // Sign out
    await server.auth.signOut();
    console.log('\\nSigned out successfully.');

  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  basicExample().catch(console.error);
}

export { basicExample };