const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Menyediakan file statis (index.html, calculator.js)
app.use(express.static(__dirname));

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server Node.js berjalan di http://localhost:${PORT}`);
});
