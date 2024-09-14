console.log("Products frontend javascript file");
$(function () {
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
      if (result.data) $(".new-product-status").blur();
    } catch (err) {
      console.log(err);
      alert("Product update failed!");
    }
  });
  $(".update-sale-btn").on("click", async function (e) {
    const id = $(this).data("id");
    const productSale = $(`#sale-${id}`).val();
    const productPrice = $(`#price-${id}`).text(); // Assuming productPrice is displayed as text
    const productStatus = $(`#${id}`).val();

    // Validate sale percentage and price
    if (productStatus !== "ONSALE") {
      alert(
        "Sale percentage can only be updated for products that are ONSALE!"
      );
      return;
    }

    // Calculate the sale price
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
        $(`#sale-price-${id}`).text(productSalePrice.toFixed(2)); // Update sale price display
      } else {
        alert("Product update failed!");
      }
    } catch (err) {
      console.log("Error:", err);
      alert("Product update failed!");
    }
  });
});
function validateForm() {
  const productName = $(".product-name").val();
  const productPrice = $(".product-price").val();
  const productLeftCount = $(".product-left-count").val();
  const productCollection = $(".product-desc").val();
  const productDesc = $(".product-name").val();
  const productStatus = $(".product-status").val();

  if (
    productName === "" ||
    productPrice === "" ||
    productLeftCount === "" ||
    productCollection === "" ||
    productDesc === "" ||
    productStatus === ""
  ) {
    alert("Please insert all required inputs");
    return false;
  } else return true;
}
function previewFileHandler(input, order) {
  const imgClassName = input.className;
  const file = $(`.${imgClassName}`).get(0).files[0],
    fileType = file["type"],
    validImageType = ["image/jpg", "image/jpeg", "image/png"];
  if (!validImageType.includes(fileType)) {
    alert("Please, insert only jpeg, jpg and png!");
  } else {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#image-section-${order}`).attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
