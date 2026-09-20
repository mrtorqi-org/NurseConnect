from django.urls import path
from . import views

urlpatterns = [
    path('requirements/', views.RequirementListCreateView.as_view(), name='requirement-list'),
    path('requirements/<int:pk>/', views.RequirementDetailView.as_view(), name='requirement-detail'),
    path('requirements/<int:pk>/matches/', views.RequirementMatchesView.as_view(), name='requirement-matches'),
    path('requirements/<int:pk>/approve/', views.ApproveRequirementView.as_view(), name='requirement-approve'),
    path('shortlists/', views.CreateShortlistView.as_view(), name='shortlist-create'),
    path('shortlists/<int:pk>/', views.ShortlistDetailView.as_view(), name='shortlist-detail'),
    path('shortlists/<int:pk>/send/', views.SendShortlistView.as_view(), name='shortlist-send'),
    path('hospital/shortlists/', views.HospitalShortlistsView.as_view(), name='hospital-shortlists'),
    path('admin/stats/', views.AdminStatsView.as_view(), name='admin-stats'),
]
