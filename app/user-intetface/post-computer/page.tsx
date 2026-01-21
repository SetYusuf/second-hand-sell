import Image from 'next/image';
import './pcomputer.css';

export default function PostComputerPage() {
  return (
    <div className="post-finding-page">
      <header className="post-finding-header">
        <div className="brand-badge">
          <span className="brand-icon">
            <Image src="/home/computer.png" alt="Post Computer" width={32} height={32} />
          </span>
          <span className="brand-name">Post Computer</span>
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
            <h2>Computer Details</h2>
            <input type="text" placeholder="Title (e.g. MacBook Pro M1 2020)" />
            <select defaultValue="">
              <option value="" disabled>
                Type
              </option>
              <option>Laptop</option>
              <option>Desktop</option>
              <option>Monitor</option>
              <option>Accessories</option>
              <option>Parts</option>
            </select>
            <input type="text" placeholder="Brand (e.g. Apple, Dell, Asus)" />
            <input type="text" placeholder="Specs (RAM, Storage, Processor)" />
            <input type="text" placeholder="Condition (e.g. New, Used, Like New)" />
            
            <div className="input-prefix">
              <span>$</span>
              <input type="number" placeholder="Price" min="0" step="0.01" />
            </div>
            <textarea placeholder="Description (Defects, Warranty, etc.)" rows={4} />
            <input type="text" placeholder="Location" />
          </section>

          <section className="form-section">
            <h2>Contact Detail</h2>
            <input type="text" placeholder="Your Name" />
            <input type="tel" placeholder="Phone number" />
            <input type="email" placeholder="Email" />
          </section>

          <button type="submit" className="submit-btn">
            Post Computer
          </button>
        </form>
      </main>
    </div>
  );
}
