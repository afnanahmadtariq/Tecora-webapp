// Mock database (use real DB like MongoDB, PostgreSQL in the future)
const posts = [];

exports.createPost = (req, res) => {
  const { title, content, category } = req.body;

  // Validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    category: category || 'General',
    createdAt: new Date(),
  };

  posts.push(newPost);
  console.log(newPost);
  res.status(201).json({ message: 'Post created successfully.', post: newPost });
};
