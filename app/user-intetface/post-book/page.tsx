import Image from 'next/image';
import './pbook.css';

export default function PostBookPage() {
  return (
    <div className="post-finding-page">
      <header className="post-finding-header">
        <div className="brand-badge">
          <span className="brand-icon">
            <Image src="/home/book.png" alt="Post Book" width={32} height={32} />
          </span>
          <span className="brand-name">Post Book</span>
        </div>
      </header>

      <main className="post-finding-content">
        <form className="post-finding-form">
          <section className="form-section">
            <h2>Photo</h2>
            <label className="photo-upload" htmlFor="photo">
              <div className="photo-icon">
                <span style={{ fontSize: '2rem' }}>+</span>
              </div>
              <span>Add Photo</span>
            </label>
            <input id="photo" type="file" className="sr-only" />
          </section>

          <section className="form-section">
            <h2>Book Details</h2>
            <input type="text" placeholder="Book Title" />
            <input type="text" placeholder="Author Name" />
            <select defaultValue="">
              <option value="" disabled>
                Category
              </option>
              <option>Textbook</option>
              <option>Novel</option>
              <option>Comic</option>
              <option>Other</option>
            </select>
            <div className="input-prefix">
              <span>$</span>
              <input type="number" placeholder="Price" min="0" step="0.01" />
            </div>
            <textarea placeholder="Description (Condition, Edition, etc.)" rows={4} />
            <input type="text" placeholder="Location (e.g. RUPP Campus)" />
          </section>

          <section className="form-section">
            <h2>Contact Detail</h2>
            <input type="text" placeholder="Your Name" />
            <input type="tel" placeholder="Phone number" />
            <input type="email" placeholder="Email" />
          </section>

          <button type="submit" className="submit-btn">
            Post Book
          </button>
        </form>
      </main>
    </div>
  );
}
