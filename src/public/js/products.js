$(function () {
  // Handle product status change
  $("#process-btn").on("click", () => {
    $(".dish-container").slideToggle(500);
    $("#process-btn").css("display", "none");
  });

  $("#cancel-btn").on("click", () => {
    $(".dish-container").slideToggle(100);
    $("#cancel-btn").css("display", "flex");
  });
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

      // Disable sale input if product is not ONSALE or status is Process/Delete/Pause
      if (
        ["Process", "Delete", "Pause", "ONSALE"].indexOf(productStatus) === -1
      ) {
        $(`#sale-${id}`).prop("disabled", true); // Disable sale input
      } else if (productStatus === "ONSALE") {
        $(`#sale-${id}`).prop("disabled", false); // Enable sale input
      }

      $(".new-product-status").blur();
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
        productSalePrice: Math.floor(productSalePrice), // Round down to nearest integer
      });

      const result = response.data;
      if (result.data) {
        alert("Product sale percentage and price updated successfully!");
        $(`#sale-price-${id}`).text(Math.floor(productSalePrice)); // Display the sale price as an integer
      } else {
        alert("Product update failed!");
      }
    } catch (err) {
      console.log("Error:", err);
      alert("Product update failed!");
    }
  });
});
