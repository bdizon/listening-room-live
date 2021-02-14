from django.shortcuts import render

# Create your views here.
# render index template then let react take care of whats inside of index.html
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')