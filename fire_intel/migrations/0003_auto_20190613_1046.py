# Generated by Django 2.2.2 on 2019-06-13 17:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fire_intel', '0002_auto_20190612_0908'),
    ]

    operations = [
        migrations.RenameField(
            model_name='intelreport',
            old_name='eastside_ang',
            new_name='eastside_atgs',
        ),
        migrations.RenameField(
            model_name='intelreport',
            old_name='eastside_vlat',
            new_name='in_region_lat',
        ),
        migrations.RenameField(
            model_name='intelreport',
            old_name='in_region_ang',
            new_name='westside_atgs',
        ),
        migrations.RemoveField(
            model_name='intelreport',
            name='in_region_firebosses',
        ),
        migrations.RemoveField(
            model_name='intelreport',
            name='in_region_rotors',
        ),
        migrations.RemoveField(
            model_name='intelreport',
            name='westside_ang',
        ),
        migrations.RemoveField(
            model_name='intelreport',
            name='westside_vlat',
        ),
    ]
