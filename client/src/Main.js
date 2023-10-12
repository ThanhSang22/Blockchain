import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div>
        <h1 className="textH1">SUPPLY CHAIN</h1>
          <h2 className="textH2">ADD ITEM</h2>
          <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.createProduct(name, price)
        }}>
            Cost in Wei :{" "}
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />

            Item Identifier :{" "}
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
            
            <button className="button" type="submit">Create New Item</button>
            </form>
      <center><h2 className="Showitem">SHOW ITEMS</h2></center>
            <table className="table" >
          <thead className='table-col-wrapper'>
            <tr>
              <th scope="col" className='table-col-heading'>S.No</th>
              <th scope="col" className='table-col-heading'>Name of Item</th>
              <th scope="col" className='table-col-heading'>Price of Item</th>
              <th scope="col" className='table-col-heading'>Address of Item</th>
              <th scope="col" className='table-col-heading'>State of Item</th>
            </tr>
          </thead>
          <tbody id="productList" className="items">
            { this.props.products.map(function (item, key) {
              return(
                //filling in the values in the table
              
                <tr key={key} >
                  <th scope="row" className='table-col-body'>{key+1}</th>
                  <td className='table-col-body'>{item.itemName} wei</td>
                  <td className='table-col-body'>{item.cost}</td>
                  <td className='table-col-body'>{item.address}</td>
                  <td className='table-col-body'>{item.state}</td>
                  <td>
        { !item.purchased
          ? <button
              name={item.id}
              value={item.price}
              type="submit"
              onClick={(event) => {
                this.purchaseProduct(event.target.name, event.target.value)
              }}
            >
              Buy
            </button>
          : null
        }
        </td>
                </tr>
                
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;