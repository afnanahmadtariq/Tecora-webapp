<?php
// Azure App Service default behavior is to route to index.php as the entry point

// Display a simple message
echo "<h1>Welcome to My Azure Web App!</h1>";
echo "<p>This is a simple PHP app running on Azure Web App.</p>";

// You can also show some environment information
echo "<h2>Server Info</h2>";
echo "<pre>";
print_r($_SERVER);
echo "</pre>";
?>
