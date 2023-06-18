/*three.module.jsの要素持ってくる*/
import * as THREE from 'three'; //THREEという変数で使えるようにする
import { OrbitControls } from "./jsm/controls/OrbitControls.js";//スクロール操作ができるようにするためにOrbitControls.jsをインポート

let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init); //ページがロードし終わったらinit関数を呼び、3Dオブジェクトの処理が実行される

function init() {
  // シーンの追加(スクリーンに映る土台)
  scene = new THREE.Scene();

  // カメラを追加(シーンを映す)
  camera = new THREE.PerspectiveCamera(
    50, // 視野角
    window.innerWidth / window.innerHeight, //アスペクト比(スクリーンの横幅一杯 / 縦幅一杯)
    0.1, // 開始距離
    1000 //終了距離
  );
  camera.position.set(0, 0, +500); //カメラの位置をZ軸に+500移動させる(手間にカメラを移動させる)

  // レンダラーを追加(カメラで撮影しているシーンの内容をブラウザに表示させるために変換する)
  renderer = new THREE.WebGLRenderer({ alpha: true }); //括弧内に設定を追加できる(今回の場合は'alpha'透明度を、'true'有りにする)
  renderer.setSize(window.innerWidth, window.innerHeight); //レンダラーのサイズを(スクリーンの横幅一杯 / 縦幅一杯)にする
  renderer.setPixelRatio(window.devicePixelRatio); //スクリーンの大きさにあわせて、ピクセル数を変えて、画質を上げる
  document.body.appendChild(renderer.domElement); //HTML要素のbodyタグの子要素としてレンダラーを入れる
  renderer.render(scene, camera); //セクション2-14、レンダラーを表示させるためのコード

  //***'scene'シーンに追加する要素 start***

  // テクスチャを追加してみよう
  let textures = new THREE.TextureLoader().load("./textures/earth.jpg");

  // ジオメトリ(3Dオブジェクト)を作成
  let ballGeometry = new THREE.SphereGeometry(100, 64, 32); //球体のジオメトリ(半径, ポリゴン数, 分割数)
  //マテリアル(材質)を作成
  let ballMaterial = new THREE.MeshPhysicalMaterial({ map: textures });
  //メッシュ化してみよう(ジオメトリとマテリアルを組み合わせる)
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh); //シーンにメッシュ化した球体を追加する

  // 平行光源を追加
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2); //平行光源(色, 光の強さ) '0x'とすることで、16進数での色指定ができる
  directionalLight.position.set(1, 1, 1); //平行光源の位置を(X=1, Y=1, Z=1)にして、斜めから照らすようにする
  scene.add(directionalLight); //シーンに平行光源を追加する

  // ポイント光源を追加
  pointLight = new THREE.PointLight(0xffffff, 1); //ポイント光源(色, 光の強さ) '0x'とすることで、16進数での色指定ができる
  pointLight.position.set(-200, -200, -200); //平行光源の位置を(X=-200, Y=-200, Z=-200)にして、後ろ斜めから照らすようにする
  scene.add(pointLight); //シーンにポイント光源を追加する

  // ポイント光源がどこにあるのかを特定する
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30); //ポイント光源元を表示(何を表示させるか, 大きさ)
  scene.add(pointLightHelper); //シーンにポイント光源元の表示を追加する

  // マウス操作ができるようにしよう
  controls = new OrbitControls(camera, renderer.domElement);

  // レンダラーのサイズをリサイズされる度に更新
  window.addEventListener("resize", onWindowResize);

  animate();
  //***'scene'シーンに追加する要素 end***
}

// ブラウザのリサイズに対応させよう
function onWindowResize() {
  // レンダラーのサイズを正す
  renderer.setSize(window.innerWidth, window.innerHeight) //レンダラーのサイズを(スクリーンの横幅一杯 / 縦幅一杯)にする
  // カメラのアスペクト比を正す
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); //カメラを変更するとき必要
}

// ポイント光源を球体の周りを巡回させよう
function animate() {
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500), //X座標を(現在の時間 / 500)
    200 * Math.sin(Date.now() / 1000), //Y座標を(現在の時間 / 1000)
    200 * Math.cos(Date.now() / 500) //Z座標を(現在の時間 / 500)
  );
  
  //レンダリング(表示)してみよう
  renderer.render(scene,camera); //シーンをカメラで撮ってブラウザに表示させる
  requestAnimationFrame(animate); //'animate'をフレーム単位で更新させる
}

