from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user):
        cart, created = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart = self.get_cart(request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
            
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        cart = self.get_cart(request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        if not product_id or quantity is None:
            return Response({"error": "product_id and quantity are required"}, status=status.HTTP_400_BAD_REQUEST)

        quantity = int(quantity)
        if quantity <= 0:
            CartItem.objects.filter(cart=cart, product_id=product_id).delete()
        else:
            product = get_object_or_404(Product, id=product_id)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            cart_item.quantity = quantity
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def delete(self, request):
        cart = self.get_cart(request.user)
        product_id = request.query_params.get('product_id')

        if product_id:
            CartItem.objects.filter(cart=cart, product_id=product_id).delete()
        else:
            CartItem.objects.filter(cart=cart).delete()

        serializer = CartSerializer(cart)
        return Response(serializer.data)
