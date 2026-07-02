"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CheckCircle, Award, Users, BookOpen, Clock, FileText, ArrowRight, Loader } from "lucide-react";

export default function AcademyPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [hasExperience, setHasExperience] = useState("none");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [intakeMonth, setIntakeMonth] = useState("");
  const [studyMode, setStudyMode] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const modules = [
    {
      num: "01",
      title: "Fundamentals of Tailoring",
      topics: [
        "Sewing Tools & Machine Equipment basics",
        "Hand stitching and seam stitch profiles",
        "Fabric analysis, fibers, and texture handling",
        "Body measurement systems & charting",
        "Basic skirt and trouser drafts",
        "Equipment maintenance & shop safety",
      ],
    },
    {
      num: "02",
      title: "Intermediate Tailoring Techniques",
      topics: [
        "Precision darts, pleats, gathers, and pockets",
        "Inserting zippers, waistbands, collars, and sleeves",
        "Trouser waist letting-out and pattern alterations",
        "Introductory draping on mannequin frames",
        "Design principles & color coordination",
      ],
    },
    {
      num: "03",
      title: "Dressmaking Essentials",
      topics: [
        "Advanced dress bodice drafting",
        "Occasion wear silhouettes & panels layouts",
        "Corsetry drafting and structure support lines",
        "Evening gowns construction and linings",
        "Custom bead placement and fabric applique detailing",
      ],
    },
    {
      num: "04",
      title: "Professional Development & Business",
      topics: [
        "Fashion illustration & design sketching",
        "Costing structures, fabric yields, and markup margins",
        "Portfolio styling & digital showcase layouts",
        "Client relationship management & fitting courtesy",
        "Fashion entrepreneurship (Starting a Ruiru boutique)",
      ],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        date_of_birth: dateOfBirth,
        gender,
        id_number: idNumber,
        email,
        phone,
        address,
        city,
        county,
        education_level: educationLevel,
        has_experience: hasExperience,
        emergency_name: emergencyName,
        emergency_relationship: emergencyRelationship,
        emergency_phone: emergencyPhone,
        intake_month: intakeMonth,
        study_mode: studyMode,
        additional_info: additionalInfo,
      };

      const res = await fetch("/api/submit-enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        // Reset form
        setFullName("");
        setDateOfBirth("");
        setGender("");
        setIdNumber("");
        setEmail("");
        setPhone("");
        setAddress("");
        setCity("");
        setCounty("");
        setEducationLevel("");
        setHasExperience("none");
        setEmergencyName("");
        setEmergencyRelationship("");
        setEmergencyPhone("");
        setIntakeMonth("");
        setStudyMode("");
        setAdditionalInfo("");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.details || errorData.error || "Submission failed"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the server. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-24 bg-bg-primary">
        {/* Hero Banner */}
        <section className="py-12 bg-bg-secondary border-b border-border-custom text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Fashion Academy</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Master the Craft of Fashion Design
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Equip yourself with practical, self-sustaining skills. Standardized classes led by industry professionals in Ruiru.
            </p>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="py-12 border-b border-border-custom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Duration", value: "2 Years", icon: Clock, desc: "Diploma / Certificate" },
                { title: "Class Size", value: "Max 15", icon: Users, desc: "Personalized guidance" },
                { title: "Intakes", value: "Monthly", icon: BookOpen, desc: "Flexible calendar" },
                { title: "Location", value: "Ruiru Studio", icon: Award, desc: "Kiambu County" },
              ].map((item, idx) => (
                <div key={idx} className="bg-bg-secondary p-6 rounded-xl border border-border-custom text-center space-y-2">
                  <div className="flex justify-center text-brand-gold">
                    <item.icon size={22} />
                  </div>
                  <h3 className="text-xs text-text-tertiary uppercase tracking-wider">{item.title}</h3>
                  <div className="text-xl font-bold text-brand-plum dark:text-brand-gold">{item.value}</div>
                  <p className="text-[10px] text-text-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum Modules */}
        <section className="py-16 bg-bg-secondary border-b border-border-custom">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center space-y-2 mb-12">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Curriculum Syllabus</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">Course Outlines</h2>
              <div className="stitch-divider max-w-xs mx-auto"></div>
            </div>

            <div className="space-y-6">
              {modules.map((m) => (
                <div
                  key={m.num}
                  className="bg-bg-primary p-6 sm:p-8 rounded-xl border border-border-custom shadow-sm hover:border-brand-gold transition-colors duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-serif font-black text-brand-gold/40">{m.num}</div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-plum dark:text-brand-gold">
                      {m.title}
                    </h3>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    {m.topics.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-brand-gold shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enrollment Form */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center space-y-2 mb-12">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Apply Online</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">Reserve Your Spot</h2>
              <div className="stitch-divider max-w-xs mx-auto"></div>
              <p className="text-text-secondary text-xs sm:text-sm max-w-md mx-auto">
                Complete this form to submit your expression of interest. Our admissions counselor will contact you within 24 hours.
              </p>
            </div>

            {success ? (
              <div className="bg-bg-secondary p-8 rounded-xl border border-brand-gold text-center space-y-4 shadow-lg animate-in zoom-in-95">
                <CheckCircle size={48} className="text-green-600 dark:text-green-400 mx-auto" />
                <h3 className="font-serif text-xl font-bold">Application Received!</h3>
                <p className="text-sm text-text-secondary max-w-sm mx-auto">
                  Thank you for applying to Victory Fashion Training Academy. We will call you at your WhatsApp number shortly to complete details.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-6 py-2 rounded font-bold text-xs uppercase tracking-wider shadow"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-bg-secondary p-6 sm:p-8 rounded-xl border border-border-custom shadow-xl space-y-6">
                
                {/* Personal Info */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-gold border-b border-border-custom pb-2 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      >
                        <option value="">Select Gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">National ID / Passport Number *</label>
                      <input
                        type="text"
                        required
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="e.g. 12345678"
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-gold border-b border-border-custom pb-2 mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 2547XXXXXXXX or 07XXXXXXXX"
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Physical Address *</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Sunrise Estate, Ruiru"
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">County *</label>
                      <input
                        type="text"
                        required
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        placeholder="Kiambu"
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Course Selection */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-gold border-b border-border-custom pb-2 mb-4">
                    Course Selection & Intake
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Preferred Intake Month *</label>
                      <select
                        required
                        value={intakeMonth}
                        onChange={(e) => setIntakeMonth(e.target.value)}
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      >
                        <option value="">Select Intake</option>
                        <option value="january">January Intake</option>
                        <option value="may">May Intake</option>
                        <option value="september">September Intake</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Study Mode *</label>
                      <select
                        required
                        value={studyMode}
                        onChange={(e) => setStudyMode(e.target.value)}
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      >
                        <option value="">Select Mode</option>
                        <option value="full-time">Full-Time (Mon-Fri)</option>
                        <option value="part-time">Part-Time (Saturdays)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-gold border-b border-border-custom pb-2 mb-4">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Relationship *</label>
                      <input
                        type="text"
                        required
                        value={emergencyRelationship}
                        onChange={(e) => setEmergencyRelationship(e.target.value)}
                        placeholder="Mother / Spouse"
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="07XXXXXXXX"
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-secondary">Additional Info / Experience</label>
                  <textarea
                    rows={3}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Tell us about your background or career goals..."
                    className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal py-3.5 rounded-md font-bold text-sm uppercase tracking-wider shadow hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Enrollment Application</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
