$(document).ready(function () {
    // Function to fetch user's orders from API
    function fetchOrders() {
        var accessToken = localStorage.getItem("access_token");

        // Check if access token is available
        if (!accessToken) {
            console.error("Access token not found.");
            // Handle the case where access token is not available
            toastr.info("Please login to access your cart");
            return;
        }
        $.ajax({
            url: "https://ksdfj-1.onrender.com/api/user/orders/orders/orders/", // Update with your API endpoint
            type: "GET",
            headers: {
                Authorization: "Bearer " + accessToken, // Include access token in the request headers
            },
            success: function (response) {
                // Clear previous cart content
                $("#CartContainer").empty();

                // Check if orders are empty
                if (response.length === 0) {
                    $("#CartContainer").html("<p>Your cart is empty.</p>");
                    return;
                }

                // Iterate through orders and append to cart container
                $.each(response, function (index, order) {
                    // Create HTML for order item with delete button
                    var orderItemHtml =
                        '<div class="cart-item">' +
                        "<h5>" +
                        order.order_items.product_name +
                        "</h5>" +
                        "<p>Total Cost: " +
                        order.total_cost +
                        "</p>" +
                        '<button class="delete-order-btn" data-order-id="' +
                        order.id +
                        '">Delete</button>' +
                        "</div>";

                    // Append order item HTML to cart container
                    $("#CartContainer").append(orderItemHtml);
                });

                // Event listener for delete order button
                $(".delete-order-btn").on("click", function () {
                    var orderId = $(this).data("order-id");
                    deleteOrder(orderId);
                });
            },
            error: function (xhr, status, error) {
                console.error("Failed to fetch orders:", error);
                // Display error message
                $("#CartContainer").html(
                    "<p>Failed to fetch orders. Please try again later.</p>"
                );
            },
        });
    }

    // Function to delete an order
    function deleteOrder(orderId) {
        $.ajax({
            url: "https://ksdfj-1.onrender.com/api/user/orders/orders/orders/" + orderId + "/", // Update with your API endpoint
            type: "DELETE",
            success: function () {
                // Order deleted successfully, fetch updated orders
                fetchOrders();
                toastr.success("Manage your cart.");
            },
            error: function (xhr, status, error) {
                console.error("Failed to delete order:", error);
                // Display error message
                toastr.error("Failed to delete order. Please try again later.");
            },
        });
    }

    // Fetch user's orders when the page loads
    fetchOrders();
});
