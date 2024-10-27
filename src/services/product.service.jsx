import * as httpRequest from "~/utils/httpRequest";

export const product = "product";

export const getProduct = async (id) => {
  try {
    const res = await httpRequest.get(`${product}/${id}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const getProducts = async () => {
  try {
    const res = await httpRequest.get(`${product}`);
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};

export const filterProducts = async (page, limit, sortOrder, search) => {
  try {
    const res = await httpRequest.post(
      `${product}/filter?page=${page}&limit=${limit}&sortOrder=${sortOrder}`,
      search
    );
    return res;
  } catch (err) {
    return {
      data: err.response.data,
    };
  }
};