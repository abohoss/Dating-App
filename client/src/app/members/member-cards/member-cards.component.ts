import { Component, input } from '@angular/core';
import { Member } from '../../_models/Member';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-cards',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-cards.component.html',
  styleUrl: './member-cards.component.css'
})
export class MemberCardsComponent {
  member = input.required<Member>();
}
