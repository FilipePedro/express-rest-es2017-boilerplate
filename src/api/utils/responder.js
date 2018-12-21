class Responder {
  data(data) {
    this._status = true;
    this._data = data;
    return this;
  }

  pagination(data) {
    this._pagination = data;
    return this;
  }

  json() {
    const {
      _status: status,
      _data: data,
      _error: errors,
      _pagination: pagination,
    } = this;

    const response = {
      status,
      data,
      errors,
      pagination,
    };
    return Object.keys(response).reduce(
      (res, current) => (response[current] ? { ...res, [current]: response[current] } : res),
      {},
    );
  }

  static respondSuccess(data, pagination) {
    const response = new Responder();
    return response
      .data(data)
      .pagination(pagination)
      .json();
  }

  // static respondError(error) {
  //   const response = new Responder();
  //   return response
  //     .error(error.message ? error.message : error.error, 313)
  //     .json();
  // }
}

module.exports = Responder;
