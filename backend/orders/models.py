from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Preparing', 'Preparing'),
        ('Out for Delivery', 'Out for Delivery'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )
    PAYMENT_STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Failed', 'Failed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.CASCADE)
    
    # Delivery Info (matching checkout form)
    fullName = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    streetAddress = models.TextField()
    city = models.CharField(max_length=100)
    postalCode = models.CharField(max_length=20)
    state = models.CharField(max_length=100)
    
    # Metadata
    orderDate = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    totalAmount = models.DecimalField(max_digits=10, decimal_places=2)
    paymentStatus = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Pending')
    paymentMethod = models.CharField(max_length=50, default='Mock Payment')

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name if self.product else 'Unknown Product'} in Order #{self.order.id}"
