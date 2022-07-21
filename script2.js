(function main() {
    //----------- ----------- ----------- SETUP---------------------------------
    //scene is container that holds all the objects and lights
    const scene = new THREE.Scene();

    //in order to view things inside scene we need camera
    const fov = 60;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // render out actual graphics to the scene... needs to know which DOM element to use(canvas)

    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);
    camera.position.setX(-3);

    // Torus

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff6347,
    });

    const torus = new THREE.Mesh(geometry, material);

    scene.add(torus);

    //lights
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(20, 20, 20);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    // torus.position.set(20, 20, 0);
    torus.position.set(-30, -0.5, 28);

    //scene.add(pointLight);

    //helpers
    //const lightHelper = new THREE.PointLightHelper(pointLight);
    //const gridHelper = new THREE.GridHelper(200, 50);
    //scene.add(lightHelper, gridHelper);

    //ORBIT CONTROLS DOESNT WORK? MAYBE NEED MODULES
    //const controls = new OrbitControls(camera, renderer.domElement);

    //add stars
    function addStar() {
        const geometry = new THREE.SphereGeometry(0.25, 24, 24);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);

        const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(500));

        star.position.set(x, y, z);
        scene.add(star);
    }

    Array(5000).fill().forEach(addStar);

    // Background

    const spaceTexture = new THREE.TextureLoader().load(
        "https://s3.amazonaws.com/spicedling/IUXjBk-7tc88OYLrLIO6BY8E81ygLfE1.jpg  "
    );
    scene.background = spaceTexture;

    // Avatar

    const jeffTexture = new THREE.TextureLoader().load(
        "https://s3.amazonaws.com/spicedling/at_tahvxpqT9hIJRIoO3p3N0XTUy9Xgi.png"
    );

    const jeff = new THREE.Mesh(
        new THREE.BoxGeometry(4, 4, 4),
        new THREE.MeshBasicMaterial({ map: jeffTexture })
    );

    scene.add(jeff);

    jeff.position.set(5, 0, -12);

    // Moon

    const moonTexture = new THREE.TextureLoader().load(
        "https://s3.amazonaws.com/spicedling/zS3QL3icqM0CW8-RLB1SEfJOIdoqPv5C.png"
    );

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({
            map: moonTexture,
        })
    );

    scene.add(moon);

    moon.position.set(35, -0.5, 31.5);

    // ADD CLOUD/ PARTICLES FOR SEARCH FIRENDS

    const cloud = new THREE.Points(
        new THREE.SphereGeometry(20, 80, 80),
        // new THREE.TorusKnotGeometry(3.5, 1.5, 50, 200, 2, 3),
        new THREE.PointsMaterial({
            color: "blue",

            size: 0.2,
        })
    );

    scene.add(cloud);

    cloud.position.set(76, 0, 55);
    // Scroll Animation

    function moveCamera() {
        const t = document.body.getBoundingClientRect().top;
        moon.rotation.y += 0.01;

        jeff.rotation.y += 0.01;
        jeff.rotation.z += 0.01;

        camera.position.z = t * -0.05;
        camera.position.x = t * -0.05;
        camera.rotation.y = t * -0.0002;
    }

    document.body.onscroll = moveCamera;
    moveCamera();

    //animate/render

    function animate() {
        requestAnimationFrame(animate);
        torus.rotation.x += 0.001;
        torus.rotation.y += 0.001;
        torus.rotation.z += 0.001;

        cloud.rotation.x += 0.001;
        cloud.rotation.y += 0.001;
        cloud.rotation.z += 0.001;

        moon.rotation.y += 0.005;

        jeff.rotation.x += 0.005;
        jeff.rotation.y += 0.005;

        renderer.render(scene, camera);
    }
    animate();

    /*
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const loader = new THREE.TextureLoader();

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({
            map: loader.load(
                "https://s3.amazonaws.com/spicedling/PP1ISsZMu9ci_ZFqh86t774J8W8Ffv4e.jpg"
            ),
        });

        //  const material = new THREE.MeshPhongMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }
    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];

    /*
    const material = new THREE.MeshPhongMaterial({ color: 0xff9900 });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    camera.position.z = 5;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();


    function render(time) {
        time *= 0.001; // convert time to seconds

        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * 0.1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


    */
})();
