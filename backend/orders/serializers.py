from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer
from cart.models import Cart, CartItem

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'price', 'quantity')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'fullName', 'email', 'phone', 'streetAddress',
            'city', 'postalCode', 'state', 'orderDate', 'status',
            'totalAmount', 'paymentStatus', 'paymentMethod', 'items'
        )
        read_only_fields = ('id', 'user', 'orderDate', 'status', 'totalAmount', 'paymentStatus')

    def create(self, validated_data):
        user = self.context['request'].user
        cart = Cart.objects.filter(user=user).first()
        
        if not cart or not cart.items.exists():
            raise serializers.ValidationError("Your cart is empty.")

        # Calculate total price and compile items
        total_amount = 0
        cart_items = list(cart.items.all())
        
        for item in cart_items:
            total_amount += item.product.price * item.quantity

        # Create order object
        order = Order.objects.create(
            user=user,
            totalAmount=total_amount,
            status='Pending',
            paymentStatus='Paid',  # Mock payments succeed automatically
            **validated_data
        )

        # Create OrderItems and clean Cart
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.price,
                quantity=item.quantity
            )
            item.delete()  # Remove item from cart

        return order
