import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class BewusstseinsProjektionsSystem {
    constructor() {
        // Setup der 3D-Szene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        // Kontrollen für Kamerabewegung
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.z = 15;
        
        // Das innere Selbst - ein komplexes, organisches Partikelfeld
        this.inneresSelbst = this.erstellePartikelSystem(500, 0x1a75ff);
        this.scene.add(this.inneresSelbst);
        
        // Die projizierte Außenwelt - ein spiegelndes Partikelfeld
        this.aussenwelt = this.erstellePartikelSystem(500, 0xff5c33);
        this.scene.add(this.aussenwelt);
        
        // F-Symbol als Verbindungselement zwischen beiden Welten
        this.fSymbol = this.erstelleFSymbol();
        this.scene.add(this.fSymbol);
        
        // Interaktive Parameter
        this.polarität = 0.5;
        this.bewusstseinsIntensität = 0.7;
        this.transformationsRate = 0.05;
        
        // Event-Listener für Nutzerinteraktion
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('click', this.onMouseClick.bind(this));
        
        // Animation starten
        this.animate();
    }
    
    erstellePartikelSystem(anzahl, farbe) {
        const geometrie = new THREE.BufferGeometry();
        const positionen = new Float32Array(anzahl * 3);
        
        for (let i = 0; i < anzahl * 3; i += 3) {
            positionen[i] = (Math.random() - 0.5) * 10;
            positionen[i + 1] = (Math.random() - 0.5) * 10;
            positionen[i + 2] = (Math.random() - 0.5) * 10;
        }
        
        geometrie.setAttribute('position', new THREE.BufferAttribute(positionen, 3));
        
        const material = new THREE.PointsMaterial({
            color: farbe,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        return new THREE.Points(geometrie, material);
    }
    
    erstelleFSymbol() {
        const gruppe = new THREE.Group();
        
        // Hauptlinie des F
        const hauptLinie = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 8, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        hauptLinie.position.set(0, 0, 0);
        gruppe.add(hauptLinie);
        
        // Obere Querlinie
        const obereLinie = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        obereLinie.position.set(2, 3.5, 0);
        gruppe.add(obereLinie);
        
        // Mittlere Querlinie
        const mittlereLinie = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        mittlereLinie.position.set(1.5, 0, 0);
        gruppe.add(mittlereLinie);
        
        return gruppe;
    }
    
    onMouseMove(event) {
        // Umwandlung der Mausposition in normalisierte Werte (-1 bis 1)
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        
        // Mausposition beeinflusst die Polarität des Systems
        this.polarität = (x + 1) / 2;
        this.bewusstseinsIntensität = (y + 1) / 2;
        
        // F-Symbol reagiert auf Mausbewegung
        this.fSymbol.rotation.y = x * Math.PI;
        this.fSymbol.rotation.x = y * Math.PI / 4;
    }
    
    onMouseClick() {
        // Bei Klick: Transformation auslösen
        this.transformiere();
    }
    
    transformiere() {
        // Eine plötzliche Veränderung im System auslösen
        // (entspricht dem "Ego-Erkenntnis"-Moment)
        const positionen = this.inneresSelbst.geometry.attributes.position.array;
        
        for (let i = 0; i < positionen.length; i += 3) {
            if (Math.random() < this.transformationsRate) {
                const winkel = Math.random() * Math.PI * 2;
                const radius = 5 + Math.random() * 5;
                
                positionen[i] = Math.cos(winkel) * radius;
                positionen[i + 1] = Math.sin(winkel) * radius;
                positionen[i + 2] = (Math.random() - 0.5) * 10;
            }
        }
        
        this.inneresSelbst.geometry.attributes.position.needsUpdate = true;
    }
    
    update() {
        // Implementierung der Bewusstseins-Projektions-Logik
        const innerePositionen = this.inneresSelbst.geometry.attributes.position.array;
        const äußerePositionen = this.aussenwelt.geometry.attributes.position.array;
        
        // Projektion des inneren auf das äußere
        for (let i = 0; i < innerePositionen.length; i += 3) {
            // Inneres beeinflusst äußeres (Projektion)
            äußerePositionen[i] = innerePositionen[i] + (Math.random() - 0.5) * this.polarität;
            äußerePositionen[i + 1] = innerePositionen[i + 1] + (Math.random() - 0.5) * this.polarität;
            äußerePositionen[i + 2] = innerePositionen[i + 2] + (Math.random() - 0.5) * this.polarität;
            
            // Äußeres beeinflusst inneres (Rückkopplung)
            innerePositionen[i] += (äußerePositionen[i] - innerePositionen[i]) * 0.01 * this.bewusstseinsIntensität;
            innerePositionen[i + 1] += (äußerePositionen[i + 1] - innerePositionen[i + 1]) * 0.01 * this.bewusstseinsIntensität;
            innerePositionen[i + 2] += (äußerePositionen[i + 2] - innerePositionen[i + 2]) * 0.01 * this.bewusstseinsIntensität;
        }
        
        this.inneresSelbst.geometry.attributes.position.needsUpdate = true;
        this.aussenwelt.geometry.attributes.position.needsUpdate = true;
        
        // F-Symbol pulsiert mit der "Lebenskraft" des Systems
        const pulsation = 1 + 0.1 * Math.sin(Date.now() * 0.001);
        this.fSymbol.scale.set(pulsation, pulsation, pulsation);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// System starten
const bewusstseinsProjektion = new BewusstseinsProjektionsSystem();
