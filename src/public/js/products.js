$(function () {
  // Handle product status change
  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id;
    const productStatus = $(`#${id}.new-product-status`).val();

    console.log("id:", id);
    console.log("productstatus", productStatus);

    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });

      console.log("response", response);
      const result = response.data;

      // Check if status is ONSALE to allow sale percentage update
      if (result.data && productStatus !== "ONSALE") {
        // Set sale price to N/A if the product is not on sale
        $(`#sale-price-${id}`).text("N/A");
      } else {
        $(".new-product-status").blur();
      }
    } catch (err) {
      console.log(err);
      alert("Product update failed!");
    }
  });

  // Handle sale percentage update
  $(".update-sale-btn").on("click", async function (e) {
    const id = $(this).data("id");
    const productSale = $(`#sale-${id}`).val();
    const productPrice = $(`#price-${id}`).text(); // Assuming productPrice is displayed as text
    const productStatus = $(`#${id}.new-product-status`).val();

    // Validate sale percentage and price
    if (productStatus !== "ONSALE") {
      alert(
        "Sale percentage can only be updated for products that are 'ONSALE'!"
      );
      return;
    }

    // Calculate the sale price if the product is ONSALE
    const numericProductPrice = parseFloat(productPrice);
    const numericProductSale = parseFloat(productSale);
    const productSalePrice =
      numericProductPrice - (numericProductPrice * numericProductSale) / 100;

    try {
      // Send a POST request to update the sale percentage and sale price
      const response = await axios.post(`/admin/product/${id}`, {
        productSale: numericProductSale,
        productSalePrice: productSalePrice,
      });

      const result = response.data;
      if (result.data) {
        alert("Product sale percentage and price updated successfully!");
        $(`#sale-price-${id}`).text(productSalePrice.toFixed(0)); // Update sale price display
      } else {
        alert("Product update failed!");
      }
    } catch (err) {
      console.log("Error:", err);
      alert("Product update failed!");
    }
  });
});
