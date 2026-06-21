from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'price', 'quantity')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'fullName', 'totalAmount', 'status', 'paymentStatus', 'orderDate')
    list_filter = ('status', 'paymentStatus', 'orderDate')
    search_fields = ('fullName', 'email', 'phone', 'id')
    readonly_fields = ('orderDate', 'totalAmount')
    inlines = [OrderItemInline]
    ordering = ('-orderDate',)
