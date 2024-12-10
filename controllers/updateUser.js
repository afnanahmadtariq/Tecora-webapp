require("dotenv").config(); 
const { neon } = require("@neondatabase/serverless");
// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});

// Log the configuration
console.log(cloudinary.config());

// Cloudinary upload function
const uploadToCloudinary = async (imagePath) => {
    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        console.log(result);
        return result.public_id;
    } catch (error) {
        console.error(error);
    }
};

const sql = neon(process.env.DATABASE_URL);

exports.updateUser = async (req, res) => {
  const { username, email, password, bio, profile_pic, expertise, social_links } = req.body;
  let uploadedImageUrl;
    
    // If a new image is selected, upload to Cloudinary first
    if (profile_pic && typeof profile_pic !== 'string') {
        const file = profile_pic;
        uploadedImageUrl = await uploadToCloudinary(file);
        if (!uploadedImageUrl) {
        // Handle error: image upload failed
        console.log("Failed to upload the image. Please try again.");
        return;
        }
    }

  try {
    const result = await sql`
      UPDATE "User"
      SET 
        "username" = ${username},
        "email" = ${email},
        "password" = ${password},
        "bio" = ${bio},
        "profile_pic" = ${uploadedImageUrl},
        "expertise" = ${expertise},
        "social_links" = ${social_links}
      WHERE "user_id" = 1
      RETURNING "user_id";
    `;
    res.status(201).json({
      message: "User created successfully",
      user_id: result[0].user_id,
    });
  } catch (err) {
    console.error("Error inserting user data:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};
