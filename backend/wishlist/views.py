from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from products.models import Product
from .models import WishlistItem
from .serializers import WishlistItemSerializer

class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user)
        serializer = WishlistItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)
        wishlist_item = WishlistItem.objects.filter(user=request.user, product=product)

        if wishlist_item.exists():
            wishlist_item.delete()
            return Response({"message": "Product removed from wishlist", "added": False}, status=status.HTTP_200_OK)
        else:
            WishlistItem.objects.create(user=request.user, product=product)
            return Response({"message": "Product added to wishlist", "added": True}, status=status.HTTP_201_CREATED)
