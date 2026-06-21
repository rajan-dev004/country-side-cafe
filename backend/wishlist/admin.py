from django.contrib import admin
from .models import WishlistItem

@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'added_at')
    list_filter = ('user',)
    search_fields = ('product__name',)
