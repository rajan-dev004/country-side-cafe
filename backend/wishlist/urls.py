from django.urls import path
from .views import WishlistView

urlpatterns = [
    path('wishlistdetail/', WishlistView.as_view(), name='wishlist-detail'),
]
