import React from 'react'

export default function SimpleAudioPlayer({ playlist }) {
    return (
        <div className="simple-player">
            <h3>Music Player</h3>
            {playlist && playlist.length > 0 && (
                <div>
                    {playlist.map((track, idx) => (
                        <div key={idx} className="track-item">
                            <audio controls style={{ width: '100%', marginBottom: '10px' }}>
                                <source src={track.url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            <p>
                                <strong>{track.title}</strong> - {track.artist.join(', ')}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
