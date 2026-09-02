export const CAMERA_VIEWER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; }
        canvas { display: block; width: 100vw; height: 100vh; }
    </style>
    <!-- Load Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
    <script>
        let scene, camera, renderer, material;
        let isUserInteracting = false, onPointerDownPointerX = 0, onPointerDownPointerY = 0, lon = 0, onPointerDownLon = 0, lat = 0, onPointerDownLat = 0, phi = 0, theta = 0;
        let isLoaded = false;
        let pinchDistanceStart = 0;
        let fovStart = 75;

        // Settings from React Native
        let aperture = 0; // 0 to 1 (Blur)
        let shutterSpeed = 0.5; // 0 to 1 (Brightness/Motion blur)
        let iso = 0; // 0 to 1 (Noise + Brightness)

        function init(imageUrl) {
            const container = document.createElement('div');
            document.body.appendChild(container);

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
            camera.target = new THREE.Vector3(0, 0, 0);

            scene = new THREE.Scene();

            const geometry = new THREE.SphereGeometry(500, 60, 40);
            geometry.scale(-1, 1, 1); // invert the geometry

            const textureLoader = new THREE.TextureLoader();
            textureLoader.setCrossOrigin('anonymous');
            const texture = textureLoader.load(imageUrl, function() {
                // Post ready message to React Native
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
            });

            const shader = {
                uniforms: {
                    "tDiffuse": { value: texture },
                    "aperture": { value: aperture },
                    "shutterSpeed": { value: shutterSpeed },
                    "iso": { value: iso }
                },
                vertexShader: [
                    "varying vec2 vUv;",
                    "void main() {",
                    "    vUv = uv;",
                    "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
                    "}"
                ].join('\\n'),
                fragmentShader: [
                    "uniform sampler2D tDiffuse;",
                    "uniform float aperture;",
                    "uniform float shutterSpeed;",
                    "uniform float iso;",
                    "varying vec2 vUv;",
                    "float rand(vec2 co){",
                    "    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
                    "}",
                    "void main() {",
                    "    vec4 color = texture2D(tDiffuse, vUv);",
                    "    float noise = (rand(vUv * (iso + 0.1)) - 0.5) * iso * 0.4;",
                    "    float shutterBrightness = (shutterSpeed - 0.5) * 1.5; ",
                    "    float isoBrightness = iso * 0.8; ",
                    "    color.rgb += noise;",
                    "    color.rgb *= (1.0 + shutterBrightness + isoBrightness);",
                    "    float blurAmount = aperture * 0.005;",
                    "    if(blurAmount > 0.0001) {",
                    "        vec4 blurColor = color;",
                    "        blurColor += texture2D(tDiffuse, vUv + vec2(blurAmount, 0.0));",
                    "        blurColor += texture2D(tDiffuse, vUv - vec2(blurAmount, 0.0));",
                    "        blurColor += texture2D(tDiffuse, vUv + vec2(0.0, blurAmount));",
                    "        blurColor += texture2D(tDiffuse, vUv - vec2(0.0, blurAmount));",
                    "        blurColor += texture2D(tDiffuse, vUv + vec2(blurAmount * 0.7, blurAmount * 0.7));",
                    "        blurColor += texture2D(tDiffuse, vUv - vec2(blurAmount * 0.7, blurAmount * 0.7));",
                    "        blurColor += texture2D(tDiffuse, vUv + vec2(blurAmount * 0.7, -blurAmount * 0.7));",
                    "        blurColor += texture2D(tDiffuse, vUv - vec2(blurAmount * 0.7, -blurAmount * 0.7));",
                    "        color = blurColor / 9.0;",
                    "    }",
                    "    color.r = clamp(color.r, 0.0, 1.0);",
                    "    color.g = clamp(color.g, 0.0, 1.0);",
                    "    color.b = clamp(color.b, 0.0, 1.0);",
                    "    gl_FragColor = color;",
                    "}"
                ].join('\\n')
            };

            material = new THREE.ShaderMaterial({
                uniforms: shader.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true }); 
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);

            container.style.touchAction = 'none';
            container.addEventListener('pointerdown', onPointerDown);
            document.addEventListener('wheel', onDocumentMouseWheel);
            window.addEventListener('resize', onWindowResize);
            
            container.addEventListener('touchstart', onTouchStart, { passive: false });
            container.addEventListener('touchmove', onTouchMove, { passive: false });

            animate();
            isLoaded = true;
        }

        function onWindowResize() {
            if(!camera) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onPointerDown(event) {
            if (event.isPrimary === false) return;
            isUserInteracting = true;
            onPointerDownPointerX = event.clientX;
            onPointerDownPointerY = event.clientY;
            onPointerDownLon = lon;
            onPointerDownLat = lat;
            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        }

        function onPointerMove(event) {
            if (event.isPrimary === false) return;
            lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
            lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
        }

        function onPointerUp(event) {
            if (event.isPrimary === false) return;
            isUserInteracting = false;
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        }

        function onDocumentMouseWheel(event) {
            if(!camera) return;
            const fov = camera.fov + event.deltaY * 0.05;
            camera.fov = THREE.MathUtils.clamp(fov, 10, 100);
            camera.updateProjectionMatrix();
        }

        function onTouchStart(event) {
            if (event.touches.length === 2 && camera) {
                const dx = event.touches[0].pageX - event.touches[1].pageX;
                const dy = event.touches[0].pageY - event.touches[1].pageY;
                pinchDistanceStart = Math.sqrt(dx * dx + dy * dy);
                fovStart = camera.fov;
            }
        }

        function onTouchMove(event) {
            if (event.touches.length === 2 && camera) {
                const dx = event.touches[0].pageX - event.touches[1].pageX;
                const dy = event.touches[0].pageY - event.touches[1].pageY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (pinchDistanceStart > 0) {
                    const scale = pinchDistanceStart / distance;
                    const newFov = fovStart * scale;
                    camera.fov = THREE.MathUtils.clamp(newFov, 10, 100);
                    camera.updateProjectionMatrix();
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            update();
        }

        function update() {
            lat = Math.max(-85, Math.min(85, lat));
            phi = THREE.MathUtils.degToRad(90 - lat);
            theta = THREE.MathUtils.degToRad(lon);

            camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
            camera.target.y = 500 * Math.cos(phi);
            camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

            camera.lookAt(camera.target);
            renderer.render(scene, camera);
        }
        
        // --- React Native Interface ---
        
        window.setImage = function(url) {
            if (isLoaded) {
                const textureLoader = new THREE.TextureLoader();
                textureLoader.setCrossOrigin('anonymous');
                material.uniforms.tDiffuse.value = textureLoader.load(url);
            } else {
                init(url);
            }
        };
        
        window.setEffects = function(ap, ss, isoVal) {
            if(material) {
                material.uniforms.aperture.value = ap;
                material.uniforms.shutterSpeed.value = ss;
                material.uniforms.iso.value = isoVal;
            }
        };

        window.takeScreenshot = function() {
            if(!renderer) return;
            // Render once to make sure buffer is updated
            renderer.render(scene, camera);
            const dataUrl = renderer.domElement.toDataURL('image/jpeg', 0.9);
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'screenshot',
                data: dataUrl
            }));
        };
        
        // Notify ready just in case
        document.addEventListener('DOMContentLoaded', () => {
             window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'init' }));
        });
    </script>
</body>
</html>`;
