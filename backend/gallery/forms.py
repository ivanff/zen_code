from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class RegForm(forms.ModelForm):
    password1 = forms.CharField(max_length=20)
    password2 = forms.CharField(max_length=20)

    def clean(self):
        if self.cleaned_data['password1'] != self.cleaned_data['password2']:
            raise ValidationError("Пароли не совпадают.")
        if User.objects.filter(username=self.cleaned_data['username']).exists():
            raise ValidationError("Пользователь уже существует.")
        return super().clean()

    def save(self, commit=False):
        user = super().save(False)
        user.set_password(self.cleaned_data['password1'])
        user.save()
        return user

    class Meta:
        model = User
        fields = [
            'username',
            'email'
        ]
