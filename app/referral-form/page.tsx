"use client";
import { useState, useEffect } from "react";

export default function page() {
  const [formData, setFormData] = useState<any>({});
  const handleSubmit = async (e: any) => {
    event?.preventDefault();
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Referrer Info</h1>
      <div>
        <label htmlFor="name">Full Name:</label>
        <input
          onChange={handleChange}
          type="text"
          value={formData.name}
          id="name"
          name="name"
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email Address:</label>
        <input
          onChange={handleChange}
          type="email"
          value={formData.email}
          id="email"
          name="email"
          required
        />
      </div>

      <div>
        <p>Relationship To The Marcy Lab School</p>
        <label>
          <input
            onChange={handleChange}
            type="radio"
            value="fellow"
            name="relationship"
            required
          />
          Current Fellow
        </label>
        <label>
          <input
            onChange={handleChange}
            type="radio"
            value="alum"
            name="relationship"
            required
          />
          Alumni
        </label>

        <label>
          <input
            onChange={handleChange}
            type="radio"
            value="staff"
            name="relationship"
            required
          />
          Staff
        </label>
      </div>

      <div>
        <p>How did you hear about this referral opportunity? </p>
        <label>
          <input
            onChange={handleChange}
            type="radio"
            value="email"
            name="how"
            required
          />
          Email
        </label>

        <label>
          <input
            onChange={handleChange}
            type="radio"
            value="slack"
            name="how"
            required
          />
          Slack
        </label>

        <label>
          <input
            onChange={handleChange}
            type="radio"
            value="website"
            name="how"
            required
          />
          Website
        </label>

        <label>
          <input
            onChange={handleChange}
            type="radio"
            value="other"
            name="how"
            required
          />
          Other
        </label>
      </div>

      <h1>Canidate Info</h1>
      <div>
        <label htmlFor="name">Full Name:</label>
        <input
          onChange={handleChange}
          type="text"
          value={formData.referreeName}
          id="referreeName"
          name="referreeName"
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email Address:</label>
        <input
          onChange={handleChange}
          type="email"
          value={formData.referreeEmail}
          id="referreeEmail"
          name="referreeEmail"
          required
        />
      </div>

      <div>
        <label htmlFor='gender'>Gender Identification: (Optional)</label>
        <input
          onChange={handleChange}
          type="text"
            value={formData.refereeGender}
            id="refereeGender"
            name="refereeGender"
        />
      </div>

        <div>
            <label htmlFor='refereeLinkedIn'>LinkedIn Profile: (Optional)</label>
            <input type='text' onChange={handleChange} id='refereeLinkedIn' name='refereeLinkedIn' value={formData.refereeLinkedIn} />
        </div>
    </form>
  );
}
