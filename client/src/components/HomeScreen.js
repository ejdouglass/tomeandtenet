import React, {useState, useEffect, useRef} from 'react';


export default function HomeScreen() {
    const [blob, setBlob] = useState('');
    const [jotting, setJotting] = useState(false);
    const jotRef = useRef(null);

    const handleKeyDown = (e) => {
        // alert(`You booped the ${e.key} key!`);
        if (e.key === 'Tab') {
            e.preventDefault();
            setBlob(blob + '    ');
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [blob]);

    return (
        <div iam='homePageContainer'>

            <div iam='jots' style={{border: '1px solid green'}}>
                <h1>I am JOTS. Behold:</h1>
                <textarea ref={jotRef} rows={jotting ? 20 : 5} onFocus={() => setJotting(true)} onBlur={() => setJotting(false)} style={{resize: 'none', margin: '2rem', padding: '0.5rem', fontSize: '1.2rem', width: '80%', opacity: jotting ? '1' : '0.3'}} type='text' value={blob} onChange={e => setBlob(e.target.value)}></textarea>
            </div>

            <div iam='resources' style={{border: '1px solid blue'}}>
                (Resource links area for pinned links)
            </div>

            <div iam='cta_study' style={{border: '1px solid purple'}}>
                GO STUDY! Kafwoosh
            </div>

        </div>
    )
}