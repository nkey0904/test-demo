import React, { useState, useEffect } from 'react';

// Giả lập dữ liệu user lấy từ API (có chứa script độc hại)
const mockUserData = {
    username: "hacker123",
    bio: "Hello! <img src=x onerror=alert('Hacked!')> Welcome to my profile."
};

export default function UserProfile() {
    const [user, setUser] = useState(mockUserData);

    return (
        <div className="profile-card">
            <h1>{user.username}</h1>
            
            <div className="bio-section">
                <h3>User Bio:</h3>
                
                {/* ❌ LỖI BẢO MẬT: XSS */}
                {/* Semgrep sẽ bắt dòng này vì pattern: <$TAG ... dangerouslySetInnerHTML={...} ... /> */}
                <div dangerouslySetInnerHTML={{ __html: user.bio }} />
            </div>

            {/* Một trường hợp khác Semgrep cũng bắt (Object property) */}
            {/* pattern: "{ dangerouslySetInnerHTML: ... }" */}
            {React.createElement('div', {
                dangerouslySetInnerHTML: { __html: '<b>Bold Text but unsafe</b>' }
            })}
        </div>
    );
}