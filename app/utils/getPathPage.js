export function getPathPage() {
  const { pathname } = window.location; // Get the pathname from the URL
  const pathParts = pathname.split('/').filter(Boolean); // Split by '/' and filter out empty parts
  
  return pathParts[0] || ''; // Return the first part after the domain or an empty string if not present
}


export function toPascalCase(str) {
    return str
      .split('/') // Split the string by '/'
      .filter(Boolean) // Remove empty parts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
      .join(''); // Join the parts without any delimiter
  }
  
  // Function to get the path immediately after the domain and convert it to Pascal Case
