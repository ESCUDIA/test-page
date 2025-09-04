import * as components from "/components.js";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBvVcUi3jMyMGbthEZvm0oCZr01CQbnJnA",
  authDomain: "esc-tech.firebaseapp.com",
  databaseURL: "https://esc-tech.firebaseio.com",
  projectId: "esc-tech",
  storageBucket: "esc-tech.appspot.com",
  messagingSenderId: "29626765085",
  appId: "1:29626765085:web:26e4ff24597b8df7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore().collection('websites').doc('suplementosmx');
if (window.location.hostname == 'localhost') {
  firebase.functions().useFunctionsEmulator('http://localhost:5001');
}

var siteData = {};


async function init() {
  try {

    await components.init();



    let $loginPage = document.querySelector(".login.page");
    let $header = document.querySelector("header");
    let $logBtn = $header.querySelector("#log-btn");


    window.addEventListener("popstate", (e) => {
      if (!e.state) {
        let $page = document.querySelector(".page:last-of-type");
        $page.remove();
      } else {
        let $page = window[e.state]();
        document.body.appendChild($page);
      }
    });


    let $lF = new components.loginForm(firebase);



    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {

        let siteSnapshop = await db.get();
        siteData = siteSnapshop.data();

        let id = user.uid;
        let userSnap = await db.collection("admin").doc(id).get();
        let userData = userSnap.data();

        let storeSnap = await db.collection("stores").doc(userData.Store).get();
        let storeData = storeSnap.data();


        $lF.remove();

        $logBtn.querySelector("span").innerText = "Logout";
        $logBtn.onclick = () => {
          firebase.auth().signOut();
          location.reload();
        }

        let sMOptions = [
          {
            event: "newOrder",
            text: "NEW ORDER",
            icon: "fa-cart-plus",
          },
          {
            event: "tracking",
            text: "TRACKING",
            icon: "fa-truck",
          },
          // {
          //   event: "shipping",
          //   text: "SHIPPING",
          //   icon: "fa-truck",
          // },
        ];

        // if (storeData.OnlineStore) {
        //   sMOptions.push({
        //     event: "shopify",
        //     text: "SHOPIFY",
        //     icon: "fa-store",
        //   });
        // }

        let $sM = new components.selectMenu(sMOptions);

        $loginPage.querySelector(".main-section").appendChild($sM);

        $sM.addEventListener("newOrder", async (e) => {
          try {
            history.pushState("orderPage", null, "newOrder");
            let $oP = await window.orderPage(userData);
            document.body.appendChild($oP);
          } catch (err) {
            console.log(err);
          }
        });

        $sM.addEventListener("tracking", (e) => {
          history.pushState("trackingPage", null, "tracking");
          let $tP = window.trackingPage();
          document.body.appendChild($tP);
        });

        $sM.addEventListener("shipping", (e) => {
          history.pushState("shippingPage", null, "shipping");
          let $sP = window.shippingPage();
          document.body.appendChild($sP);
        });

        $sM.addEventListener("shopify", (e) => {
          history.pushState("shopifyPage", null, "shopify");
          let $sP = window.shopifyPage();
          document.body.appendChild($sP);
        });

        if (siteData["Super-Admin"].includes(user.uid)) {

          let whSnapshots = await db.collection("suppliers").where("Sync", "==", "manual").get();

          let manualWarehouses = [];
          whSnapshots.forEach((whSnap) => {
            let wh = whSnap.data();
            wh.id = whSnap.id;
            manualWarehouses.push(wh);
          });


          let $xP = new components.xlsxParser({ warehouses: manualWarehouses });

          $xP.addEventListener("parsed", (e) => {
            let products = e.detail.products;
            let warehouse = e.detail.warehouse;
            console.log(products, warehouse);
            db.collection("suppliers").doc(warehouse).update({
              Products: products,
            }).then(() => {
              console.log("update successfull");
            }).catch((err) => {
              console.log(err);
            });
          });
          // $xP.addEventListener("parsed", (e)=> {
          //   let filters = e.detail;
          //   db.update({
          //     SmartFilter: filters,
          //   }).then(()=> {
          //     console.log("update successfull");
          //   }).catch((err) => {
          //     console.log(err);
          //   });
          // });
          $loginPage.querySelector(".main-section").appendChild($xP);
        }

      } else {
        $logBtn.querySelector("span").innerText = "Login";
        $loginPage.querySelector(".main-section").appendChild($lF);
      }
    });

  } catch (err) {
    console.log(err);
  }
}

window.orderPage = async function (userData) {
  try {
    let template = document.querySelector("template#order-page");
    let instance = template.content.cloneNode(true);
    let $page = instance.querySelector(".page");

    let w1PO = firebase.functions().httpsCallable("importikaPlaceOrder",  {timeout: 360000});
    let w1GP = firebase.functions().httpsCallable("importikaGetProducts");
    let w1BackupPO = firebase.functions().httpsCallable("importikaBackupPlaceOrder");
    let w1BackupGP = firebase.functions().httpsCallable("importikaBackupGetProducts");
    let escudiaPO = firebase.functions().httpsCallable("escudiaPlaceOrder");
    let escudiaGP = firebase.functions().httpsCallable("escudiaGetProducts");
    let badwolfPO = firebase.functions().httpsCallable("badwolfPlaceOrder");
    let badwolfGP = firebase.functions().httpsCallable("badwolfGetProducts");

    let $header = $page.querySelector(".header");
    let $productTable = $page.querySelector(".product-table");

    let id = firebase.auth().currentUser.uid;

    let warehouses = [];

    let w1GetProducts = async () => {
      let res = await w1GP();
      res.backup = false;
      return res;
    }

    let w1PlaceOrder = async (order) => {
      let res = await w1PO(order);
      return res;
    }

    let w1Color = "rgb(0,0,240)";

    let $wh1 = new components.orderSummary({
      warehouse: "WAREHOUSE 1",
      color: w1Color,
      placeOrder: w1PlaceOrder,
      getProducts: w1GetProducts,
    });

    warehouses.push($wh1);

    // let escudiaGetProducts = async () => {
    //   try {
    //     let res = await escudiaGP();
    //     return res;
    //   } catch (err) {
    //     console.log("GetError", err);
    //     throw err;
    //   }
    // }

    // let escudiaPlaceOrder = async (order) => {
    //   try {
    //     let res = await escudiaPO(order);
    //     return res;
    //   } catch (err) {
    //     console.log("PostError", err);
    //     throw err;
    //   }
    // }

    // let escudiaColor = "rgb(0,0,0)";

    // let $escudiaWh = new components.orderSummary({
    //   warehouse: "ESCUDIA",
    //   color: escudiaColor,
    //   placeOrder: escudiaPlaceOrder,
    //   getProducts: escudiaGetProducts,
    // });

    // warehouses.push($escudiaWh);

    let badwolfGetProducts = async () => {
      try {
        let res = await badwolfGP();
        return res;
      } catch (err) {
        console.log("GetError", err);
        throw err;
      }
    }

    let badwolfPlaceOrder = async (order) => {
      try {
        let res = await badwolfPO(order);
        return res;
      } catch (err) {
        console.log("PostError", err);
        throw err;
      }
    }

    let badwolfColor = "rgb(0,0,0)";

    let $badwolfWh = new components.orderSummary({
      warehouse: "BAD WOLF",
      color: badwolfColor,
      placeOrder: badwolfPlaceOrder,
      getProducts: badwolfGetProducts,
    });

    warehouses.push($badwolfWh);

    let whSnapshots = await db.collection("suppliers").where("Sync", "==", "manual").get();
    whSnapshots.forEach((whSnap) => {
      let wh = whSnap.data();
      wh.id = whSnap.id;

      let whGetProducts = async () => {
        try {
          let res = {};
          res.data = {
            products: wh.Products,
            auth: {
              store: userData.Store,
              name: userData.Name,
              id: id,
              warehouse: wh.id,
            }
          }
          return res;
        } catch (err) {
          console.log("GetError", err);
          throw err;
        }
      }

      let whPlaceOrder = async (order) => {
        try {
          let store = order.auth.store;
          let name = order.auth.name;
          let warehouse = order.auth.warehouse;
          await db.collection("stores").doc(store).collection("orders").add({
            Author: name,
            Warehouse: warehouse,
            Time: firebase.firestore.FieldValue.serverTimestamp(),
            Products: order.items,
          });
          let res = {};
          res.data = "ORDER SUCCESS";
          return res;
        } catch (err) {
          console.log("PostError", err);
          throw err;
        }
      }


      let $wh = new components.orderSummary({
        warehouse: wh.id,
        color: wh.Color,
        placeOrder: whPlaceOrder,
        getProducts: whGetProducts,
      });

      warehouses.push($wh);

    });


    for (let wh of warehouses) {

      wh.addEventListener("productsSuccess", function (e) {
        let products = e.detail;
        if (products) {
          for (let p of products) {
            let productName = p.product.toLowerCase();
            p.starred = false;
            for (let smart of siteData.SmartFilter) {
              let filter = smart.toLowerCase();
              if (productName.includes(filter)) {
                p.starred = true;
                break;
              }
            }
            let $pR = new components.productRow(p);
            $pR.warehouse = this.warehouse;
            $pR.color = this.color;
            $pR.addEventListener("onChange", (e) => {
              this.update($pR.item);
            });
            $pR.classList.add("raised");
            $productTable.appendChild($pR);
          }
        }
      });

      wh.addEventListener("orderSuccess", function (e) {
        let pRows = $page.querySelectorAll(".main-section > .product-table > product-row");
        for (let $r of pRows) {
          if ($r.hasAttribute("selected") && $r.warehouse == this.warehouse) {
            $r.quantity = 0;
          }
        }
        alert(e.detail);
      });

      wh.addEventListener("error", function (e) {
        alert(e.detail);
      });

      $header.appendChild(wh);
    }



    let $searchBar = $page.querySelector(".search .search-bar");
    let sFilter = searchFilter.bind($searchBar);

    let searchTimeout = null;

    $searchBar.addEventListener("keyup", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        sFilter($page);
      }, 1000);
    });
    $page.querySelector(".search .selected .checkbox").addEventListener("change", () => { sFilter($page) });

    return $page;

  } catch (err) {
    throw err;
  }
}

window.trackingPage = function () {
  let template = document.querySelector("template#tracking-page");
  let instance = template.content.cloneNode(true);
  let $page = instance.querySelector(".page");

  let $trackingTable = $page.querySelector(".tracking-table");
  let $spinner = $page.querySelector(".spinner-wrapper");

  let getTracking = firebase.functions().httpsCallable("importikaGetTracking");
  getTracking().then((res) => {
    for (let t of res.data) {
      let $tR = new components.trackingRow(t);
      $tR.classList.add("raised");

      $trackingTable.appendChild($tR);
    }
    $spinner.classList.add("hidden");
  }).catch((err) => {
    console.log(err);
  });
  return $page;
}

window.shopifyPage = function () {
  let template = document.querySelector("template#shopify-page");
  let instance = template.content.cloneNode(true);
  let $page = instance.querySelector(".page");

  let $fileInput = $page.querySelector("input.file");
  let $uploadBtn = $page.querySelector("button.upload");

  let $aC = new components.accountCard();
  $page.appendChild($aC);

  // let reader = new FileReader();

  // reader.onload = (e) => {
  //   let b = e.target.result;
  //   console.log(b);
  // }

  let canvas = document.createElement("CANVAS");

  let canvasCtx = canvas.getContext("2d");

  let img = new Image;
  
  img.onload = (e) => {
    
    let maxLength = 500;

    let aspectRatio = img.width / img.height;

    if (aspectRatio < 1) {
      canvas.height = maxLength;
      canvas.width = maxLength * aspectRatio;
    } else {
      canvas.width = maxLength;
      canvas.height = maxLength / aspectRatio;
    }

    canvasCtx.drawImage(img, 0, 0,  canvas.width, canvas.height);

    $page.appendChild(canvas);

    canvas.toBlob((blob) => {
      console.log(blob);
    });
  }

  $uploadBtn.addEventListener('click', (e) => {
    let file = $fileInput.files[0];
    console.log(file.type);
    let dataAsURL = window.URL.createObjectURL(file);
    img.src = dataAsURL;
  });
  $fileInput.addEventListener('change', (e) => {
    let file = $fileInput.files[0];
    console.log(file.type);
    let dataAsURL = window.URL.createObjectURL(file);
    img.src = dataAsURL;
  });

  return $page;
}

window.shippingPage = function () {
  let template = document.querySelector("template#shipping-page");
  let instance = template.content.cloneNode(true);
  let $page = instance.querySelector(".page");

  let $mainContent = $page.querySelector(".main-section");

  // let $pP = new components.pagePopup();
  let $sFOrigin = new components.shippingForm({ new: true, title: 'ORIGIN' });
  let $sFDestination = new components.shippingForm({ new: true, title: 'DESTINATION' });
  // $sFOrigin.slot = 'content';
  // $sFDestination.slot = 'content';
  $mainContent.appendChild($sFOrigin);
  $mainContent.appendChild($sFDestination);

  let $input = document.createElement('input');
  $input.placeholder = 'Peso (5 Default)';
  // $input.slot = 'content';
  // $button.classList.add('btn');
  $mainContent.appendChild($input);


  let $button = document.createElement('button');
  $button.innerText = 'GENERAR';
  // $button.slot = 'content';
  $button.classList.add('btn');
  $mainContent.appendChild($button);


  let getZips = async function (e) {
      try {
          this.connection = 'connecting';
          let zip = e.detail;
          let zips = [];
          console.log(zip);
          let getPostalInfo = firebase.functions().httpsCallable("paquetexpressGetPostalInfo");
          let res = await getPostalInfo({ postal: zip });

          res.data.forEach((zip) => {
              let z = {
                  col: zip.colonia.toUpperCase(),
                  municipality: zip.municipio.toUpperCase(),
                  city: zip.ciudad.toUpperCase(),
                  state: zip.estado.toUpperCase(),
                  country: zip.pais.toUpperCase(),
                  extended: zip.sucursal.endsWith('70'),
              };
              zips.push(z);
          });

          this.colOptions(zips);
          if (zips.length > 0) {
              this.municipality = zips[0].municipality;
              this.city = zips[0].city;
              this.state = zips[0].state;
              this.country = zips[0].country;
          } else {
              this.municipality = '';
              this.city = '';
              this.state = '';
              this.country = '';
          }

          console.log(zips);

      } catch (err) {
          console.error(err.message);
      } finally {
          this.connection = '';
      }
  }



  $sFOrigin.addEventListener('zip', getZips);
  $sFDestination.addEventListener('zip', getZips);

  $button.addEventListener('click', async (e) => {

      try {

          if ($sFOrigin.checkValidity() && $sFDestination.checkValidity()) {
              $sFOrigin.connection = 'connecting';
              $sFDestination.connection = 'connecting';
              let origin = $sFOrigin.profile;
              let destination = $sFDestination.profile;
              let weight = $input.value ? parseFloat($input.value) : 4.9;
              console.log(origin, destination, weight);

              let placeShipping = firebase.functions().httpsCallable("paquetexpressManualShipping");
              let res = await placeShipping({ destination, origin, weight});
              console.log(res.data);

              window.open(`https://cc.paquetexpress.com.mx:8082/wsReportPaquetexpress/GenCartaPorte?trackingNoGen=${res.data.number}`);

              // app.notification('success', res.data.message);               
          }

      } catch (err) {                
          console.error("Failed Creating shipping", err.message);
          // app.notification('error', err.message);
      } finally {
          $sFOrigin.connection = '';
          $sFDestination.connection = '';
      }

  });

  // document.body.appendChild($pP);

  return $page;
}


function searchFilter($page) {
  let search = this.value.toLowerCase();
  let searchValues = search.split(" ");
  let pRows = $page.querySelectorAll(".main-section > .product-table > product-row");
  let onlySelected = $page.querySelector(".search .selected .checkbox").checked;
  loop1: for (let $pR of pRows) {
    if (onlySelected) {
      if (!$pR.hasAttribute("selected")) {
        $pR.classList.add("hidden");
        continue;
      }
    }
    let name = $pR.product.toLowerCase();
    let id = $pR.productId.toLowerCase();

    for (let sV of searchValues) {
      if (!name.includes(sV) && !id.includes(sV)) {
        $pR.classList.add("hidden");
        continue loop1;
      }
    }
    $pR.classList.remove("hidden");
  }
}


init();


