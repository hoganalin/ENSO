```jsx
function Checkout() {
  return (
    <div className="bg-light pt-5 pb-7">
      <div className="container">
        <div className="row justify-content-center flex-md-row flex-column-reverse">
          <div className="col-md-6">
            <div className="bg-white p-4">
              <h4 className="fw-bold">1. Contact Form</h4>
              <p className="mt-4">Contact information</p>
              <form>
                <div className="mb-2">
                  <label
                    htmlFor="ContactMail"
                    className="text-muted mb-0 form-label"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-0"
                    id="ContactMail"
                    aria-describedby="emailHelp"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input rounded-0"
                    id="ContactLorem"
                  />
                  <label className="form-check-label" htmlFor="ContactLorem">
                    Lorem ipsum dolor sit amet, consetetur
                  </label>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="ContactName"
                    className="text-muted mb-0 form-label"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    id="ContactName"
                    placeholder="Carmen A. Rose"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="ContactPhone"
                    className="text-muted mb-0 form-label"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    id="ContactPhone"
                    placeholder="0933-123-123"
                  />
                </div>
              </form>
            </div>
            <div className="bg-white p-4 mt-3">
              <h4 className="fw-bold">2. Shipping Form</h4>
              <form>
                <p className="mt-4 mb-3">Shipping address</p>
                <div className="form-row">
                  <div className="col mb-2">
                    <select id="inputState" className="form-select rounded-0">
                      <option selected>Country/Region</option>
                      <option>...</option>
                    </select>
                  </div>
                  <div className="col mb-2">
                    <select id="inputState" className="form-select rounded-0">
                      <option selected>City</option>
                      <option>...</option>
                    </select>
                  </div>
                </div>
                <input
                  type="text"
                  className="form-control rounded-0 mt-1"
                  id="inputCity"
                  placeholder="Address"
                />
                <p className="mt-4 mb-2">Payment</p>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gridRadios"
                    id="gridRadios1"
                    value="option1"
                    checked
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor="gridRadios1"
                  >
                    WebATM
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gridRadios"
                    id="gridRadios2"
                    value="option2"
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor="gridRadios2"
                  >
                    ATM
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gridRadios"
                    id="gridRadios3"
                    value="option3"
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor="gridRadios3"
                  >
                    ApplePay
                  </label>
                </div>
              </form>
            </div>
            <div className="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end  w-100">
              <a href="./product.html" className="text-dark mt-md-0 mt-3">
                <i className="fas fa-chevron-left me-2"></i> Lorem ipsum
              </a>
              <a
                href="./checkout-success.html"
                class="btn btn-dark py-3 px-7 rounded-0"
              >
                Lorem ipsum
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border p-4 mb-4">
              <h4 className="mb-4">Order Detail</h4>
              <div className="d-flex">
                <img
                  src="https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80"
                  alt=""
                  className="me-2"
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                />
                <div className="w-100">
                  <div className="d-flex justify-content-between fw-bold">
                    <p className="mb-0">Lorem ipsum</p>
                    <p className="mb-0">x10</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="text-muted mb-0">
                      <small>NT$12,000</small>
                    </p>
                    <p className="mb-0">NT$12,000</p>
                  </div>
                </div>
              </div>
              <div className="d-flex mt-2">
                <img
                  src="https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80"
                  alt=""
                  className="me-2"
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                />
                <div className="w-100">
                  <div className="d-flex justify-content-between fw-bold">
                    <p className="mb-0">Lorem ipsum</p>
                    <p className="mb-0">x10</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="text-muted mb-0">
                      <small>NT$12,000</small>
                    </p>
                    <p className="mb-0">NT$12,000</p>
                  </div>
                </div>
              </div>
              <table className="table mt-4 border-top border-bottom text-muted">
                <tbody>
                  <tr>
                    <th
                      scope="row"
                      className="border-0 px-0 pt-4 font-weight-normal"
                    >
                      Subtotal
                    </th>
                    <td className="text-end border-0 px-0 pt-4">NT$24,000</td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="border-0 px-0 pt-0 pb-4 font-weight-normal"
                    >
                      Payment
                    </th>
                    <td className="text-end border-0 px-0 pt-0 pb-4">
                      ApplePay
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex justify-content-between mt-4">
                <p className="mb-0 h4 fw-bold">Total</p>
                <p className="mb-0 h4 fw-bold">NT$24,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

```;
