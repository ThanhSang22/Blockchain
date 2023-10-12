import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Marketplace from "../src/contracts/ItemManager.json";
// import Navbar from './Navbar'
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Main from "./Main";

class App extends Component {
  async componentWillMount() {
    axios
      .get("http://localhost:4000/item")
      .then((response) => {
        console.log(response.data);
        this.setState({ items: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });

    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketplace = new web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      this.setState({ marketplace });
      const productCount = await marketplace.methods.itemIndex().call();
      this.setState({ productCount });

      console.log(productCount);

      for (var i = 0; i <= this.state.items.data.length - 1; i++) {
        const product = await this.state.items.data[i];
        console.log(product);
        this.setState({
          products: [...this.state.products, product],
        });
      }
      console.log(this.state.products);

      // for(var i = 0; i <= productCount - 1; i++){
      //   const item = marketplace.methods.items(i).call();
      //   item.then(value => {
      //     this.setState({
      //       products: [...this.state.products, value]
      //     })
      //   })
      //   console.log(this.state.items)
      //   }
      this.setState({ loading: false });
    } else {
      window.alert("Marketplace contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
      items: [],
    };

    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
    this.deliveryProduct = this.deliveryProduct.bind(this);
  }
  createProduct(name, price) {
    this.setState({ loading: true });
    const result = this.state.marketplace.methods
      .createItem(name, price)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });

    result.then((value) => {
      let itemAddress = value;
      console.log(itemAddress);
      const obj = {
        itemName: name,
        cost: price,
        address: itemAddress.events.SupplyChainStep.returnValues._itemAddress,
        owner: this.state.account,
        state: itemAddress.events.SupplyChainStep.returnValues._step,
      };
      axios
        .post("http://localhost:4000/item/create", obj)
        .then((res) => console.log(res.data));
    });
  }

  purchaseProduct(id, price, idPro) {
    this.setState({ loading: true });
    let result = this.state.marketplace.methods
      .triggerPayment(id)
      .send({ from: this.state.account, value: price })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
    console.log(idPro);
    result.then((value) => {
      let itemAddress = value;
      console.log(itemAddress);
      const obj = {
        state: itemAddress.events.SupplyChainStep.returnValues._step,
      };
      axios
        .put("http://localhost:4000/item//update/" + idPro, obj)
        .then((res) => console.log(res.data));
    });
  }

  deliveryProduct(id, idPro) {
    this.setState({ loading: true });
    let result = this.state.marketplace.methods
      .triggerDelivery(id)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
    console.log(idPro);
    result.then((value) => {
      let itemAddress = value;
      console.log(itemAddress);
      const obj = {
        state: itemAddress.events.SupplyChainStep.returnValues._step,
      };
      axios
        .put("http://localhost:4000/item//update/" + idPro, obj)
        .then((res) => console.log(res.data));
    });
  }

  render() {
    return (
      <>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Collapse
              id="basic-navbar-nav"
              style={{ justifyContent: "end" }}
            >
              <Navbar.Text>
                Signed in as:{" "}
                <a href="#login" id="account">
                  {this.state.account}
                </a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <h1>SUPPLY CHAIN</h1>
        <h2>ADD ITEM</h2>
        {/* <h3>OWNER: {this.state.account}</h3> */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const name = this.productName.value;
            const price = window.web3.utils.toWei(
              this.productPrice.value.toString(),
              "Ether"
            );
            this.createProduct(name, price);
          }}
        >
          Cost in Wei :{" "}
          <input
            id="productName"
            type="text"
            ref={(input) => {
              this.productName = input;
            }}
            // className="form-control"
            placeholder="Product Name"
            required
          />
          Item Identifier :{" "}
          <input
            id="productPrice"
            type="text"
            ref={(input) => {
              this.productPrice = input;
            }}
            // className="form-control"
            placeholder="Product Price"
            required
          />
          <button className="bton" type="submit">
            Create New Item
          </button>
        </form>
        <center>
          <h2 className="Showitem">SHOW ITEMS</h2>
        </center>
        <table className="table">
          <thead className="table-col-wrapper">
            <tr>
              <th scope="col" className="table-col-heading">
                S.No
              </th>
              <th scope="col" className="table-col-heading">
                Name of Item
              </th>
              <th scope="col" className="table-col-heading">
                Price of Item
              </th>
              <th scope="col" className="table-col-heading">
                Address of Item
              </th>
              <th scope="col" className="table-col-heading">
                State of Item
              </th>
            </tr>
          </thead>
          <tbody id="productList" className="items">
            {this.state.products.map((product, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{key + 1}</th>
                  <td>{product.itemName}</td>
                  <td>
                    {window.web3.utils.fromWei(
                      product.cost.toString(),
                      "Ether"
                    )}{" "}
                    Eth
                  </td>
                  <td>{product.address}</td>
                  <td>{product.state}</td>
                  <td>
                    {product.state == 0 ? (
                      <button
                        className="button1"
                        name={key}
                        value={product.cost}
                        onClick={(event) => {
                          this.purchaseProduct(
                            event.target.name,
                            event.target.value,
                            product._id
                          );
                        }}
                      >
                        Buy
                      </button>
                    ) : product.state == 1 ? (
                      <button
                        className="button1"
                        name={key}
                        value={product._id}
                        onClick={(event) => {
                          this.deliveryProduct(
                            event.target.name,
                            event.target.value
                          );
                        }}
                      >
                        Delivery
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}

export default App;
