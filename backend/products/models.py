from django.db import models

class Category(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    rating = models.FloatField(default=0.0)
    reviewsCount = models.IntegerField(default=0)
    prepTime = models.CharField(max_length=50)
    tags = models.JSONField(default=list)
    description = models.TextField()
    ingredients = models.JSONField(default=list)
    image = models.URLField(max_length=500)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name
