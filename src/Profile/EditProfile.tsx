"use client";

import React, { useState, useRef } from "react";
import { 
  User, Camera, Mail, Phone, MapPin, Shield, Eye, EyeOff, 
  CheckCircle, Car, DollarSign, ArrowLeft, Save, Trash2 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobile = useIsMobile();

  const [fullName, setFullName] = useState(user?.name || "");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [preferredCar, setPreferredCar] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState(user?.location || "Bengaluru, IN");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  if (!user) { router.push("/"); return null; }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ name: fullName, phone, location });
    router.push("/Profile");
  };

  // ── Responsive styles ──
  const card: React.CSSProperties = {
    backgroundColor: '#ffffff', borderRadius: mobile ? '14px' : '20px',
    padding: mobile ? '20px 16px' : '28px 32px', border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: mobile ? '16px' : '24px',
  };
  const title: React.CSSProperties = { fontSize: mobile ? '16px' : '18px', fontWeight: 800, color: '#111827', marginBottom: '4px' };
  const sub: React.CSSProperties = { fontSize: mobile ? '12px' : '13px', color: '#6b7280', marginBottom: mobile ? '16px' : '24px' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: mobile ? '11px' : '12px', fontWeight: 800, color: '#0059A3', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' };
  const inp: React.CSSProperties = { width: '100%', padding: mobile ? '10px 14px' : '12px 16px', borderRadius: mobile ? '10px' : '14px', border: '1px solid #e5e7eb', backgroundColor: '#F9FAFB', fontSize: mobile ? '14px' : '15px', fontWeight: 500, color: '#111827', outline: 'none', boxSizing: 'border-box' };
  const inpRO: React.CSSProperties = { ...inp, backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' };
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '12px' : '20px' };

  const getPasswordStrength = (pw: string) => {
    if (pw.length === 0) return { text: '', color: 'transparent', width: '0%' };
    if (pw.length < 6) return { text: 'Weak', color: '#EF4444', width: '33%' };
    if (pw.length < 10) return { text: 'Medium', color: '#F59E0B', width: '66%' };
    return { text: 'Strong', color: '#22C55E', width: '100%' };
  };
  const pwStrength = getPasswordStrength(newPassword);

  const PwField = ({ label: l, value, onChange, show, toggle, placeholder, error }: any) => (
    <div>
      <label style={lbl}>{l}</label>
      <div style={{ position: 'relative' }}>
        <input style={{ ...inp, borderColor: error ? '#EF4444' : '#e5e7eb' }} type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder} />
        <button type="button" onClick={toggle} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: mobile ? '16px 12px' : '32px 16px', minHeight: '85vh' }}>
      
      {/* Back */}
      <button onClick={() => router.push("/Profile")} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#0059A3', fontWeight: 700, fontSize: mobile ? '13px' : '14px', marginBottom: mobile ? '16px' : '24px', padding: 0 }}>
        <ArrowLeft size={18} /> Back to Profile
      </button>

      {/* Header */}
      <div style={{ marginBottom: mobile ? '20px' : '32px' }}>
        <h1 style={{ fontSize: mobile ? '24px' : '30px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>Edit Profile</h1>
        <p style={{ fontSize: mobile ? '13px' : '15px', color: '#6b7280', margin: 0 }}>Update your personal details and preferences</p>
      </div>

      {/* Photo */}
      <div style={card}>
        <h3 style={title}>Profile Photo</h3>
        <p style={sub}>Choose a photo that represents you</p>
        <div style={{ display: 'flex', alignItems: mobile ? 'center' : 'center', flexDirection: mobile ? 'column' : 'row', gap: mobile ? '16px' : '24px' }}>
          <div style={{ width: mobile ? '90px' : '120px', height: mobile ? '90px' : '120px', borderRadius: '50%', backgroundColor: '#F3F4F6', border: '3px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', cursor: 'pointer', flexShrink: 0 }} onClick={() => fileInputRef.current?.click()}>
            {photoPreview ? <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={mobile ? 36 : 48} style={{ color: '#9CA3AF' }} />}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', borderRadius: '50%' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}>
              <Camera size={20} style={{ color: '#ffffff' }} />
              <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: 700, marginTop: '2px' }}>Change</span>
            </div>
          </div>
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: '10px', flexDirection: mobile ? 'row' : 'column' }}>
            <button onClick={() => fileInputRef.current?.click()} style={{ padding: mobile ? '8px 16px' : '10px 24px', backgroundColor: '#0059A3', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: mobile ? '12px' : '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={14} /> Upload
            </button>
            {photoPreview && (
              <button onClick={() => setPhotoPreview(null)} style={{ padding: mobile ? '8px 16px' : '10px 24px', backgroundColor: '#fff', color: '#EF4444', border: '1px solid #FCA5A5', borderRadius: '12px', fontWeight: 700, fontSize: mobile ? '12px' : '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div style={card}>
        <h3 style={title}>Personal Information</h3>
        <p style={sub}>Your basic information for your profile</p>
        <div style={grid2}>
          <div><label style={lbl}>Full Name</label><input style={inp} type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" /></div>
          <div><label style={lbl}>Username <span style={{ color: '#9ca3af', fontWeight: 500, textTransform: 'none', letterSpacing: '0' }}>(optional)</span></label><input style={inp} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@your_username" /></div>
        </div>
        <div style={{ marginTop: mobile ? '12px' : '20px', maxWidth: mobile ? '100%' : '48%' }}>
          <label style={lbl}>Date of Birth <span style={{ color: '#9ca3af', fontWeight: 500, textTransform: 'none', letterSpacing: '0' }}>(optional)</span></label>
          <input style={inp} type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
      </div>

      {/* Contact */}
      <div style={card}>
        <h3 style={title}>Contact Details</h3>
        <p style={sub}>How people can reach you</p>
        <div style={grid2}>
          <div>
            <label style={lbl}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <Mail size={12} /> Email
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: '#DCFCE7', color: '#166534', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '50px' }}>
                  <CheckCircle size={10} /> Verified
                </span>
              </span>
            </label>
            <input style={inpRO} type="email" value={email} readOnly />
          </div>
          <div>
            <label style={lbl}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} /> Phone Number</span></label>
            <input style={inp} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div style={card}>
        <h3 style={title}>Preferences</h3>
        <p style={sub}>Help us personalize your experience</p>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: mobile ? '12px' : '20px' }}>
          <div>
            <label style={lbl}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Car size={12} /> Preferred Car Type</span></label>
            <select value={preferredCar} onChange={(e) => setPreferredCar(e.target.value)} style={{ ...inp, cursor: 'pointer', appearance: 'auto' }}>
              <option value="">Select type</option><option value="suv">SUV</option><option value="sedan">Sedan</option><option value="hatchback">Hatchback</option><option value="muv">MUV</option><option value="luxury">Luxury</option>
            </select>
          </div>
          <div>
            <label style={lbl}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={12} /> Budget Range</span></label>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ ...inp, cursor: 'pointer', appearance: 'auto' }}>
              <option value="">Select budget</option><option value="3-5">₹3L – ₹5L</option><option value="5-8">₹5L – ₹8L</option><option value="8-12">₹8L – ₹12L</option><option value="12-20">₹12L – ₹20L</option><option value="20+">₹20L+</option>
            </select>
          </div>
          <div>
            <label style={lbl}><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /> Location</span></label>
            <input style={inp} type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your city" />
          </div>
        </div>
      </div>

      {/* Security */}
      <div style={card}>
        <h3 style={{ ...title, display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} style={{ color: '#0059A3' }} /> Security</h3>
        <p style={sub}>Change your password to keep your account safe</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: mobile ? '100%' : '500px' }}>
          <PwField label="Current Password" value={currentPassword} onChange={(e: any) => setCurrentPassword(e.target.value)} show={showCurrentPw} toggle={() => setShowCurrentPw(!showCurrentPw)} placeholder="Enter current password" />
          <div>
            <PwField label="New Password" value={newPassword} onChange={(e: any) => setNewPassword(e.target.value)} show={showNewPw} toggle={() => setShowNewPw(!showNewPw)} placeholder="Enter new password" />
            {newPassword.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: '0%' }} animate={{ width: pwStrength.width }} style={{ height: '100%', backgroundColor: pwStrength.color, borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: pwStrength.color, marginTop: '4px', display: 'block' }}>{pwStrength.text}</span>
              </div>
            )}
          </div>
          <div>
            <PwField label="Confirm New Password" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} show={showConfirmPw} toggle={() => setShowConfirmPw(!showConfirmPw)} placeholder="Re-enter new password" error={confirmPassword.length > 0 && confirmPassword !== newPassword} />
            {confirmPassword.length > 0 && confirmPassword !== newPassword && (
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444', marginTop: '4px', display: 'block' }}>Passwords do not match</span>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: mobile ? 'stretch' : 'flex-end', gap: '12px',
        padding: mobile ? '16px 0' : '24px 0', borderTop: '1px solid #e5e7eb', marginTop: '8px',
        position: 'sticky', bottom: 0, backgroundColor: 'var(--background, #fdfdfd)', zIndex: 10,
        flexDirection: mobile ? 'column-reverse' : 'row',
      }}>
        <button onClick={() => router.push("/Profile")} style={{ padding: mobile ? '12px' : '12px 28px', width: mobile ? '100%' : 'auto', backgroundColor: '#ffffff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '14px', fontWeight: 700, fontSize: mobile ? '14px' : '15px', cursor: 'pointer' }}>Cancel</button>
        <button onClick={handleSave} style={{ padding: mobile ? '12px' : '12px 32px', width: mobile ? '100%' : 'auto', backgroundColor: '#0059A3', color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: mobile ? '14px' : '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(0, 89, 163, 0.3)' }}>
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
}
