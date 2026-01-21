import Image from 'next/image';
import './pservice.css';

export default function PostServicePage() {
  return (
    <div className="post-finding-page">
      <header className="post-finding-header">
        <div className="brand-badge">
          <span className="brand-icon">
            <Image src="/home/ser.png" alt="Post Service" width={32} height={32} />
          </span>
          <span className="brand-name">Post Service</span>
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
            <h2>Service Details</h2>
            <input type="text" placeholder="Title (e.g. AC Repair, Cleaning)" />
            <select defaultValue="">
              <option value="" disabled>
                Category
              </option>
              <option>Repair</option>
              <option>Cleaning</option>
              <option>Tutoring</option>
              <option>Transportation</option>
              <option>Other</option>
            </select>
            <input type="text" placeholder="Availability (e.g. Weekends, 9AM-5PM)" />
            
            <div className="input-prefix">
              <span>$</span>
              <input type="number" placeholder="Price (per hour/job)" min="0" step="0.01" />
            </div>
            <textarea placeholder="Description (Service Details, Experience, etc.)" rows={4} />
            <input type="text" placeholder="Location" />
          </section>

          <section className="form-section">
            <h2>Contact Detail</h2>
            <input type="text" placeholder="Your Name" />
            <input type="tel" placeholder="Phone number" />
            <input type="email" placeholder="Email" />
          </section>

          <button type="submit" className="submit-btn">
            Post Service
          </button>
        </form>
      </main>
    </div>
  );
}
