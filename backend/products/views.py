from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Filtering by Category
        category = self.request.query_params.get('category', None)
        if category and category != 'all':
            queryset = queryset.filter(category_id=category)
            
        # Searching by name/description/tags
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(tags__icontains=search)
            )
            
        # Filtering by price range
        min_price = self.request.query_params.get('min_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
            
        max_price = self.request.query_params.get('max_price', None)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        # Filtering by minimum rating
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)

        # Featured filtering
        featured = self.request.query_params.get('featured', None)
        if featured:
            val = featured.lower() in ('true', '1', 'yes')
            queryset = queryset.filter(featured=val)
            
        # Sorting
        sort_by = self.request.query_params.get('sort_by', None)
        if sort_by:
            if sort_by == 'price_low_high':
                queryset = queryset.order_by('price')
            elif sort_by == 'price_high_low':
                queryset = queryset.order_by('-price')
            elif sort_by == 'rating':
                queryset = queryset.order_by('-rating')
            elif sort_by == 'name':
                queryset = queryset.order_by('name')
                
        return queryset
